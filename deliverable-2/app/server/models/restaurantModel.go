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
	Lat        float64            `json:"lat" bson:"lat"`
	Lng        float64            `json:"lng" bson:"lng"`
	Address    string             `json:"address" bson:"address"`
	Categories []string           `json:"categories" bson:"categories"`
	Price      int                `json:"price,omitempty" bson:"price,omitempty"`
	Weight     int                `json:"weight" bson:"weight"`
}

type Swipe struct {
	Weight int `json:"weight" bson:"weight"`
}

type Filter struct {
	Category int     `json:"category,omitempty" bson:"category,omitempty"`
	Lat      float64 `json:"lat" bson:"lat"`
	Lng      float64 `json:"lng" bson:"lng"`
	Price    int     `json:"price,omitempty" bson:"price,omitempty"`
	Radius   int     `json:"radius,omitempty" bson:"radius,omitempty"`
}

type Radius struct {
	LowLat float64
	HiLat  float64
	LowLng float64
	HiLng  float64
}
