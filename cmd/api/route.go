package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func (app *application) routes() http.Handler{
	g := gin.Default()

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
