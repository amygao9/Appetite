package main

import (
	"log"

	"github.com/csc301-fall-2020/team-project-31-appetite/server/api"

	"github.com/joho/godotenv"
)

func main() {
	err := godotenv.Load(".env")
	if err != nil {
		log.Fatalf("Error loading .env file")
	}

	api.RouterInit()
}
