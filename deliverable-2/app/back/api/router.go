package api

import (
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
	r := mux.NewRouter()
	r.HandleFunc("/", handler).Methods("GET")

	config := getConfig()
	address := "127.0.0.1:" + config.Port

	srv := &http.Server{
		Handler:      r,
		Addr:         address,
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}
	fmt.Printf("Server running on port %s\n", config.Port)
	log.Fatal(srv.ListenAndServe())
}
