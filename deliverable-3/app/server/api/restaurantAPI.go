package api

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"
	"time"

	"github.com/csc301-fall-2020/team-project-31-appetite/server/auth"
	"github.com/csc301-fall-2020/team-project-31-appetite/server/models"
	queue "github.com/golang-collections/go-datastructures/queue"

	"math"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo/options"
	"gopkg.in/mgo.v2/bson"
)

func (data *DB) GetRestaurants(w http.ResponseWriter, r *http.Request) {
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

	result, err := data.db.Collection("restaurant").Find(data.ctx, query, options)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	var restaurants []models.Restaurant
	if err = result.All(data.ctx, &restaurants); err != nil {
		log.Print(err)
		w.Write([]byte(err.Error()))
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	response, _ := json.Marshal(restaurants)
	w.Write(response)

}

func (data *DB) GetRestaurant(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	objectID, err := getId(w, r)
	if err != nil {
		return
	}

	result := data.db.Collection("restaurant").FindOne(data.ctx, bson.M{"_id": objectID})
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
			ReviewText: review["text"].(string),
			Rating:     int(review["rating"].(float64)),
		}

		if review["user"].(map[string]interface{})["image_url"] != nil {
			restaurant.TopReview.UserImage = review["user"].(map[string]interface{})["image_url"].(string)
		}

		timeCreated, _ := time.Parse("2006-01-02 03:04:05", review["time_created"].(string))
		restaurant.TopReview.TimeCreated = timeCreated.Format("Jan. 2, 2006")

		restaurant.PhoneNumber = results["display_phone"].(string)

		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(restaurant)
	}
}

func (data *DB) AddRestaurant(w http.ResponseWriter, r *http.Request) {
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
	_, err = data.db.Collection("restaurant").InsertOne(data.ctx, restaurant)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(restaurant)
		w.Write(response)
	}
}

func (data *DB) UpdateRestaurant(w http.ResponseWriter, r *http.Request) {
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
	_, err = data.db.Collection("restaurant").ReplaceOne(data.ctx, bson.M{"_id": objectID}, restaurant)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.WriteHeader(http.StatusOK)
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(restaurant)
		w.Write(response)
	}
}

func (data *DB) Swipe(w http.ResponseWriter, r *http.Request) {
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

	restaurant, err := FindRestaurant(data, objectID)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	update := bson.M{"$inc": bson.M{"weight": swipe.Weight}}
	_, err = data.db.Collection("restaurant").UpdateOne(data.ctx, bson.M{"_id": objectID}, update)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	// restaurant categories to update
	categoryUpdate := make(map[string]bool)

	for _, cat := range restaurant.Categories {
		if _, ok := models.CategoryMap[cat]; ok {
			categoryUpdate[cat] = true
		}
	}

	user, err := FindUser(data, swipe.UserId)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}

	for name, weight := range user.Categories {
		if _, ok := categoryUpdate[name]; ok {
			user.Categories[name] = weight + swipe.Weight
		}
	}

	_, err = data.db.Collection("user").ReplaceOne(data.ctx, bson.M{"_id": swipe.UserId}, user)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	w.WriteHeader(http.StatusOK)
}

func (data *DB) DeleteRestaurant(w http.ResponseWriter, r *http.Request) {
	err := auth.ValidateToken(w, r)
	if err != nil {
		return
	}

	objectID, err := getId(w, r)
	if err != nil {
		return
	}

	_, err = data.db.Collection("restaurant").DeleteOne(data.ctx, (bson.M{"_id": objectID}))
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

// PARKJS STUFF
func ApplySigmoid(categories *map[string]float64) {
	// PARK.js Algo step 3, puts weightings through a sigmoid function
	for key, value := range *categories {
		(*categories)[key] = Sigmoid(value)
	}
}

func Sigmoid(valueIn float64) float64 {
	// Helper function - the sigmoid function itself
	var maxVal = 0.5
	var steepness = 0.2
	var offset = 0.25

	return (maxVal / (1 + math.Exp(-steepness*valueIn))) + offset
}

func NormalizeWeights(categories *map[string]float64) {
	// PARK.js Algo step 4, normalize sigmoid weights to probabilities
	var multiplier = 0.0
	for key := range *categories {
		multiplier += (*categories)[key]
	}

	for key := range *categories {
		(*categories)[key] /= multiplier
	}
}

func BuildQueues(categoriesSplice []string, restaurants []models.Restaurant) map[string]*queue.Queue {
	// PARK.js algo step 5, put restaurants into a queue
	var ret = make(map[string]*queue.Queue)
	var categories = make(map[string]bool)

	// Build hashmap for quicker lookup
	for _, category := range categoriesSplice {
		categories[category] = true
	}
	// Initialize splices in returned map
	for category := range categories {
		ret[category] = queue.New(int64(len(restaurants)))
	}
	ret["other"] = queue.New(int64(len(restaurants)))

	// Populate
	for _, restaurant := range restaurants {
		queued := false
		for _, restCategory := range restaurant.Categories {
			if _, ok := categories[restCategory]; ok {
				ret[restCategory].Put(restaurant)
				queued = true
			}
		}
		if !queued {
			ret["other"].Put(restaurant)
		}
	}

	return ret
}
