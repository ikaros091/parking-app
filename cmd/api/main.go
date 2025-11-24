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

	// Auto-create tables if they don't exist
	if err := initDatabase(db); err != nil {
		log.Fatal("Failed to initialize database:", err)
	}

	models := database.NewModels(db)
	app := &application{
		port:   env.GetEnvInt("PORT", 3000),
		models: models,
	}

	if err := app.serve(); err != nil {
		log.Fatal(err)
	}
}

// initDatabase creates tables if they don't exist
func initDatabase(db *sql.DB) error {
	createParkingSlotsTable := `
	CREATE TABLE IF NOT EXISTS parking_slots (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		car_number VARCHAR NOT NULL DEFAULT '',
		start_time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
		is_available BOOLEAN NOT NULL DEFAULT 1
	);`

	createParkingHistoryTable := `
	CREATE TABLE IF NOT EXISTS parking_history (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		car_number VARCHAR NOT NULL,
		slot_id INTEGER NOT NULL,
		start_time TIMESTAMP NOT NULL,
		end_time TIMESTAMP,
		hours INTEGER,
		charge INTEGER,
		FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
	);`

	if _, err := db.Exec(createParkingSlotsTable); err != nil {
		return err
	}

	if _, err := db.Exec(createParkingHistoryTable); err != nil {
		return err
	}

	log.Println("✅ Database tables initialized successfully")
	return nil
}
