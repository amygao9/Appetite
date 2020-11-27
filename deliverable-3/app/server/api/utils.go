package api

import (
	"net/http"

	"github.com/gorilla/mux"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getId(w http.ResponseWriter, r *http.Request) (primitive.ObjectID, error) {
	id := mux.Vars(r)["id"]
	objectID, err := primitive.ObjectIDFromHex(id)
	if err != nil {
		w.Write([]byte(err.Error()))
		return primitive.NilObjectID, err
	}

	return objectID, nil
}
