package tests

import (
	"net/http"

	"go.mongodb.org/mongo-driver/bson/primitive"
)

var port string

var newRestID primitive.ObjectID
var client *http.Client
var bearer string