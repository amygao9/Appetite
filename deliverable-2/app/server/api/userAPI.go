package api

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"backapp/auth"
	"backapp/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

func (c *Collection) AddUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	postBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(postBody, &user)
	if err != nil {
		log.Fatalf("Error unpacking restaurant data")
		w.Write([]byte(err.Error()))
		return
	}
	user.ID = primitive.NewObjectID()
	hashed, err := auth.HashPassword(user.Password)
	if err != nil {
		w.Write([]byte(err.Error()))
		return
	}
	user.Password = hashed
	_, err = c.collection.InsertOne(c.ctx, user)
	if err != nil {
		w.Write([]byte(err.Error()))
	} else {
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(user)
		w.Write(response)
	}

}
