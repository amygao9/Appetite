package models

import (
	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

var CategoryMap = map[string]bool{
	"italian":    true,
	"chinese":    true,
	"korean":     true,
	"japanese":   true,
	"greek":      true,
	"sandwiches": true,
	"bakeries":   true,
	"icecream":   true,
	"salad":      true,
	"desserts":   true,
	"coffee":     true,
	"glutenfree": true,
	"vegan":      true,
}

type User struct {
	ID         primitive.ObjectID   `json:"id,omitempty" bson:"_id,omitempty"`
	Name       string               `json:"name" bson:"name"`
	Email      string               `json:"email" bson:"email"`
	Password   string               `json:"password" bson:"password"`
	Lat        float64              `json:"latitude" bson:"latitude"`
	Lng        float64              `json:"longitude" bson:"longitude"`
	SuperLikes []primitive.ObjectID `json:"superLikes,omitempty" bson:"superLikes,omitempty"`
	Categories Categories           `json:"categories,omitempty" bson:"categories,omitempty"`
}

type AuthUser struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email    string             `json:"email" bson:"email"`
	Password string             `json:"password" bson:"password"`
}

type AuthResponse struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	AccessToken string             `json:"access_token"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

type RestaurantId struct {
	RestaurantId primitive.ObjectID `json:"restaurantId,omitempty" bson:"restaurantId,omitempty"`
}

type Categories struct {
	Italian    float64 `json:"italian" bson:"italian"`
	Chinese    float64 `json:"chinese" bson:"chinese"`
	Korean     float64 `json:"korean" bson:"korean"`
	Japanese   float64 `json:"japanese" bson:"japanese"`
	Greek      float64 `json:"greek" bson:"greek"`
	Sandwiches float64 `json:"sandwiches" bson:"sandwiches"`
	Bakeries   float64 `json:"bakeries" bson:"bakeries"`
	Icecream   float64 `json:"icecream" bson:"icecream"`
	Salad      float64 `json:"salad" bson:"salad"`
	Desserts   float64 `json:"desserts" bson:"desserts"`
	Coffee     float64 `json:"coffee" bson:"coffee"`
	Glutenfree float64 `json:"glutenfree" bson:"glutenfree"`
	Vegan      float64 `json:"vegan" bson:"vegan"`
	Other      float64 `json:"other" bson:"other"`
}

func NewCategories() Categories {
	return Categories{
		Italian:    0,
		Chinese:    0,
		Korean:     0,
		Japanese:   0,
		Greek:      0,
		Sandwiches: 0,
		Bakeries:   0,
		Icecream:   0,
		Salad:      0,
		Desserts:   0,
		Coffee:     0,
		Glutenfree: 0,
		Vegan:      0,
		Other:      0,
	}
}
