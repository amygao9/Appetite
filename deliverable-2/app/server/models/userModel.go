package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type User struct {
	ID        primitive.ObjectID   `json:"id,omitempty" bson:"_id,omitempty"`
	Name      string               `json:"name" bson:"name"`
	Email     string               `json:"email" bson:"email"`
	Password  string               `json:"password" bson:"password"`
	Latitude  float64              `json:"latitude" bson:"latitude"`
	Longitude float64              `json:"longitude" bson:"longitude"`
	Friends   []primitive.ObjectID `json:"friends,omitempty" bson:"friends,omitempty"`
}
