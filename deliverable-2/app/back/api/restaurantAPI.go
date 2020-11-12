package api

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"backapp/models"

	"github.com/gorilla/mux"
	"gopkg.in/mgo.v2/bson"
)

func (c *Collection) GetRestaurants(w http.ResponseWriter, r *http.Request) {
	result, err := c.collection.Find(c.ctx, bson.M{})
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

func (c *Collection) AddRestaurant(w http.ResponseWriter, r *http.Request) {
	var restaurant models.Restaurant
	postBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(postBody, &restaurant)
	if err != nil {
		log.Fatalf("Error unpacking restaurant data")
	}
	restaurant.ID = bson.NewObjectId()
	_, err = c.collection.InsertOne(c.ctx, restaurant)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(restaurant)
		w.Write(response)
	}
}

func (c *Collection) DeleteRestaurant(w http.ResponseWriter, r *http.Request) {
	id := mux.Vars(r)["id"]

	_, err := c.collection.DeleteOne(c.ctx, (bson.M{"_id": bson.ObjectIdHex(id)}))
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.WriteHeader(http.StatusOK)
	}
}
