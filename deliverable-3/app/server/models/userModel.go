package models

import (
	"github.com/dgrijalva/jwt-go"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

type User struct {
	ID       primitive.ObjectID   `json:"id,omitempty" bson:"_id,omitempty"`
	Name     string               `json:"name" bson:"name"`
	Email    string               `json:"email" bson:"email"`
	Password string               `json:"password" bson:"password"`
	Lat      float64              `json:"latitude" bson:"latitude"`
	Lng      float64              `json:"longitude" bson:"longitude"`
	Friends  []primitive.ObjectID `json:"friends,omitempty" bson:"friends,omitempty"`
}

type AuthUser struct {
	ID       primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Email    string             `json:"email" bson:"email"`
	Password string             `json:"password" bson:"password"`
}

type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}
