package api

import (
	"encoding/json"
	"io/ioutil"
	"log"
	"net/http"

	"github.com/csc301-fall-2020/team-project-31-appetite/server/auth"
	"github.com/csc301-fall-2020/team-project-31-appetite/server/models"

	"go.mongodb.org/mongo-driver/bson/primitive"
	"gopkg.in/mgo.v2/bson"
)

func (c *Collection) AddUser(w http.ResponseWriter, r *http.Request) {
	var user models.User
	postBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(postBody, &user)
	if err != nil {
		log.Fatalf("Error unpacking user data")
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
	}

	err = auth.CreateToken(w, user.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		w.Write([]byte(err.Error()))
		return
	} else {
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(user)
		w.Write(response)
	}
}

func (c *Collection) AuthenticateUser(w http.ResponseWriter, r *http.Request) {
	var authUser models.AuthUser
	var user models.User

	postBody, _ := ioutil.ReadAll(r.Body)
	err := json.Unmarshal(postBody, &authUser)
	if err != nil {
		log.Fatalf("Error unpacking login data")
		w.Write([]byte(err.Error()))
		return
	}

	err = c.collection.FindOne(c.ctx, bson.M{"email": authUser.Email}).Decode(&user)
	if err != nil {
		w.Write([]byte(err.Error()))
	}
	check := auth.CheckPasswordHash(authUser.Password, user.Password)
	if !check {
		w.Write([]byte("Invalid password"))
		return
	}

	err = auth.CreateToken(w, user.Email)
	if err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	} else {
		w.Header().Set("Content-Type", "application/json")
		response, _ := json.Marshal(user)
		w.Write(response)
	}
}
