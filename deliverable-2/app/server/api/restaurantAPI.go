package api

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"backapp/auth"
	"backapp/models"

	"math"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

func (c *Collection) GetRestaurants(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	var filter models.Filter
	postBody, _ := ioutil.ReadAll(r.Body)
	err = json.Unmarshal(postBody, &filter)
	if err != nil {
		log.Print("Error unpacking Filter data")
		w.Write([]byte(err.Error()))
		return
	}

	query := getFindQuery(filter)

	options := options.Find()
	options.SetSort(bson.M{"weight": -1})

	result, err := c.collection.Find(c.ctx, query, options)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	var restaurants []models.Restaurant
	if err = result.All(c.ctx, &restaurants); err != nil {
		log.Print(err)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	response, _ := json.Marshal(restaurants)
	w.Write(response)

}

func (c *Collection) GetRestaurant(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	objectID, err := getId(w, r)
	if err != nil {
		return
	}

	result := c.collection.FindOne(c.ctx, bson.M{"_id": objectID})
	err = result.Err()
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		var restaurant models.Restaurant
		result.Decode(&restaurant)

		// get more restaurant details from Yelp /businesses API
		var results map[string]interface{}
		results, err = getYelpDetails(restaurant.YelpID)
		if err != nil {
			log.Print(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}

		hours := make(map[int]string)
		for i, hour := range results["hours"].([]interface{})[0].(map[string]interface{})["open"].([]interface{}) {
			hourMap := hour.(map[string]interface{})
			start, _ := time.Parse("1504", hourMap["start"].(string))
			end, _ := time.Parse("1504", hourMap["end"].(string))
			hours[i] = start.Format("3:04 pm") + " - " + end.Format("3:04 pm")
		}

		restaurant.Hours = make(map[string]string)
		days := []string{"Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"}
		for i := 0; i < 7; i++ {
			if val, ok := hours[i]; ok {
				restaurant.Hours[days[i]] = val
			} else {
				restaurant.Hours[days[i]] = "Closed"
			}
		}

		// set ImageURL array to the array of 3 image URLs returned in Yelp details
		restaurant.ImageURL = []string{}
		for _, imageURL := range results["photos"].([]interface{}) {
			restaurant.ImageURL = append(restaurant.ImageURL, imageURL.(string))
		}

		// retrieve Yelp reviews
		var reviews []interface{}
		reviews, err = getYelpReviews(restaurant.YelpID)
		if err != nil {
			log.Print(err)
			w.WriteHeader(http.StatusInternalServerError)
			return
		}
		review := reviews[0].(map[string]interface{})

		// set Yelp review
		restaurant.TopReview = models.Review{
			UserName:   review["user"].(map[string]interface{})["name"].(string),
			UserImage:  review["user"].(map[string]interface{})["image_url"].(string),
			ReviewText: review["text"].(string),
			Rating:     int(review["rating"].(float64)),
		}

		timeCreated, _ := time.Parse("2006-01-02 03:04:05", review["time_created"].(string))
		restaurant.TopReview.TimeCreated = timeCreated.Format("Jan. 2, 2006")

		restaurant.PhoneNumber = results["display_phone"].(string)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(restaurant)
	}

}

func (c *Collection) AddRestaurant(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	var restaurant models.Restaurant
	postBody, _ := ioutil.ReadAll(r.Body)
	err = json.Unmarshal(postBody, &restaurant)
	if err != nil {
		log.Print("Error unpacking restaurant data")
		w.Write([]byte(err.Error()))
		return
	}
	restaurant.ID = primitive.NewObjectID()
	_, err = c.collection.InsertOne(c.ctx, restaurant)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(restaurant)
		w.Write(response)
	}
}

func (c *Collection) UpdateRestaurant(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	objectID, err := getId(w, r)
	if err != nil {
		return
	}

	var restaurant models.Restaurant
	postBody, _ := ioutil.ReadAll(r.Body)
	err = json.Unmarshal(postBody, &restaurant)
	if err != nil {
		log.Print("Error unpacking restaurant data")
		w.Write([]byte(err.Error()))
		return
	}
	restaurant.ID = objectID
	_, err = c.collection.ReplaceOne(c.ctx, bson.M{"_id": objectID}, restaurant)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(restaurant)
		w.Write(response)
	}
}

func (c *Collection) Swipe(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	objectID, err := getId(w, r)
	if err != nil {
		return
	}

	var swipe models.Swipe
	postBody, _ := ioutil.ReadAll(r.Body)
	err = json.Unmarshal(postBody, &swipe)
	if err != nil {
		log.Print("Error unpacking Weight data")
		w.Write([]byte(err.Error()))
		return
	}

	update := bson.M{"$inc": bson.M{"weight": swipe.Weight}}
	_, err = c.collection.UpdateOne(c.ctx, bson.M{"_id": objectID}, update)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.WriteHeader(http.StatusOK)
	}
}

func (c *Collection) DeleteRestaurant(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	objectID, err := getId(w, r)
	if err != nil {
		return
	}

	_, err = c.collection.DeleteOne(c.ctx, (bson.M{"_id": objectID}))
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.WriteHeader(http.StatusOK)
	}
}

func getRadius(filter models.Filter) models.Radius {
	var radius models.Radius

	rEarth := float64(6378)

	floatRadius := filter.Radius
	lat := filter.Lat
	lng := filter.Lng

	radius.LowLat = lat - (floatRadius/rEarth)*(180/math.Pi)
	radius.HiLat = lat + (floatRadius/rEarth)*(180/math.Pi)
	radius.LowLng = lng - (floatRadius/rEarth)*(180/math.Pi)/math.Cos(lat*math.Pi/180)
	radius.HiLng = lng + (floatRadius/rEarth)*(180/math.Pi)/math.Cos(lat*math.Pi/180)

	return radius
}

func getFindQuery(filter models.Filter) bson.M {
	var queries []bson.M
	if filter.Categories != nil && len(filter.Categories) > 0 {
		queries = append(queries, bson.M{"categories": bson.M{"$in": filter.Categories}})
	}

	if filter.Price > 0 {
		queries = append(queries, bson.M{"price": bson.M{"$eq": filter.Price}})
	}

	if filter.Radius > 0 {
		radius := getRadius(filter)
		queries = append(queries, bson.M{"lat": bson.M{"$gte": radius.LowLat, "$lte": radius.HiLat}})
		queries = append(queries, bson.M{"lng": bson.M{"$gte": radius.LowLng, "$lte": radius.HiLng}})
	}

	query := bson.M{
		"$and": queries,
	}

	return query
}
