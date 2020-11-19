package models

import "go.mongodb.org/mongo-driver/bson/primitive"

type Category int

const (
	Cafe Category = iota
	Chinese
	FastFood
	FineDining
	Italian
	Mexican
	Pizza
)

type Restaurant struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name        string             `json:"name" bson:"name"`
	Rating      int                `json:"rating" bson:"rating"`
	ImageURL    []string           `json:"imageURL,omitempty" bson:"imageURL,omitempty"`
	Location    string             `json:"location" bson:"location"`
	Address     string             `json:"address" bson:"address"`
	Description string             `json:"description" bson:"description"`
	Category    int                `json:"category" bson:"category"`
	Weight      int                `json:"weight" bson:"weight"`
}