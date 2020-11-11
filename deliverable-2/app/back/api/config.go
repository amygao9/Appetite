package api

import (
	"log"
	"os"
)

type Config struct {
	Port    string
	MongURI string
}

func getConfig() Config {
	port, portExists := os.LookupEnv("PORT")
	mongoURI, mongoURIExists := os.LookupEnv("MONGO_URI")

	if !portExists || !mongoURIExists {
		log.Fatalf("Env vars missing")
	}

	config := Config{
		Port:    port,
		MongURI: mongoURI,
	}

	return config
}
