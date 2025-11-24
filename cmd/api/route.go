package main

import (
	"net/http"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func (app *application) routes() http.Handler {
	g := gin.Default()

	// CORS middleware
	g.Use(cors.New(cors.Config{
		AllowOrigins:     []string{"http://localhost:5173", "http://localhost:3000"},
		AllowMethods:     []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"},
		AllowHeaders:     []string{"Origin", "Content-Type", "Accept"},
		ExposeHeaders:    []string{"Content-Length"},
		AllowCredentials: true,
	}))

	v1 := g.Group("/api/v1")
	{
		v1.POST("/parking/create", app.CreateParking)
		v1.POST("/parking/park", app.ParkCar)
		v1.POST("/parking/leave", app.LeaveCar)

		v1.GET("/parking/status", app.ParkingStatus)
		v1.GET("/parking/slot/:car_number", app.GetSlotByCar)
		v1.GET("/parking/history/:car_number", app.GetHistory)
	}

	return g
}
