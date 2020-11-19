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
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	YelpID     string             `json:"yelpid" bson:"yelpid"`
	Name       string             `json:"name" bson:"name"`
	Rating     float64            `json:"rating" bson:"rating"`
	NumRatings int                `json:"numratings" bson:"numratings"`
	ImageURL   []string           `json:"imageURL,omitempty" bson:"imageURL,omitempty"`
	Location   string             `json:"location" bson:"location"`
	Address    string             `json:"address" bson:"address"`
	Categories []string           `json:"categories" bson:"categories"`
	Weight     int                `json:"weight" bson:"weight"`
}
