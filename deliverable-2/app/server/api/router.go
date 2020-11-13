package api

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"

	"github.com/gorilla/mux"
)

func handler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintf(w, "hello!")
}

func RouterInit() {
	config := getConfig()
	ctx := context.Background()
	// MongoDB Atlas setup
	db := clientInit(ctx)

	r := mux.NewRouter()
	r.HandleFunc("/", handler).Methods("GET")

	// Restaurant methods
	restaurantCollection := Collection{collection: db.Collection("restaurant"), ctx: ctx}
	restaurantString := "/restaurant"
	r.HandleFunc(restaurantString+"/", restaurantCollection.GetRestaurants).Methods("GET")
	r.HandleFunc(restaurantString+"/add", restaurantCollection.AddRestaurant).Methods("POST")
	r.HandleFunc(restaurantString+"/delete/{id:[a-zA-Z0-9]*}", restaurantCollection.DeleteRestaurant).Methods("DELETE")

	address := "127.0.0.1:" + config.Port

	srv := &http.Server{
		Handler:      r,
		Addr:         address,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	// router setup
	fmt.Printf("Server running on port %s\n", config.Port)
	log.Fatal(srv.ListenAndServe())
}
