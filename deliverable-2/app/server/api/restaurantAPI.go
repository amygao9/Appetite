package api

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"backapp/auth"
	"backapp/models"

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
		log.Fatalf("Error unpacking filter data")
	}

	var radius models.Radius
	if filter.Radius != 0 {
		getRadius(filter.Lat, filter.Lng, filter.Radius, &radius)
	}

	findOptions := options.Find()
	findOptions.SetSort(bson.M{"weight": -1})

	result, err := c.collection.Find(c.ctx, bson.M{}, findOptions)
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	var restaurants []models.Restaurant
	if err = result.All(c.ctx, &restaurants); err != nil {
		log.Fatal(err)
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

	result, err := c.collection.Find(c.ctx, bson.M{"_id": objectID})
	if err != nil {
		w.WriteHeader(http.StatusBadRequest)
		w.Write([]byte(err.Error()))
		return
	}
	var restaurant models.Restaurant
	if err = result.All(c.ctx, &restaurant); err != nil {
		log.Fatal(err)
	}

	w.WriteHeader(http.StatusOK)
	w.Header().Set("Content-Type", "application/json")

	response, _ := json.Marshal(restaurant)
	w.Write(response)

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
		log.Fatalf("Error unpacking restaurant data")
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
		log.Fatalf("Error unpacking restaurant data")
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
		log.Fatalf("Error unpacking restaurant data")
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

func getRadius(lat float64, lng float64, radius int, modelRadius *models.Radius) {
	floatRadius := float64(radius)
	modelRadius.LowLat = lat - floatRadius
	modelRadius.HiLat = lat + floatRadius
	modelRadius.LowLng = lng - floatRadius
	modelRadius.HiLng = lng + floatRadius

}
