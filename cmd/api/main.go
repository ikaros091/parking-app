package main

import (
	"database/sql"
	"log"
	"rest-api-in-gin/internal/database"
	"rest-api-in-gin/internal/env"

	_ "github.com/joho/godotenv/autoload"
	_ "modernc.org/sqlite"
)

type application struct {
	port   int
	models database.Models
}

func main() {
	db, err := sql.Open("sqlite", "./data.db")
	if err != nil {
		log.Fatal(err)
	}

	defer db.Close()

	models := database.NewModels(db)
	app := &application{
		port:   env.GetEnvInt("PORT", 3000),
		models: models,
	}

	if err := app.serve(); err != nil {
		log.Fatal(err)
	}
}
