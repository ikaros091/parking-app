package main

import (
	"net/http"
	"rest-api-in-gin/internal/database"
	"time"

	"github.com/gin-gonic/gin"
)

// CreateParking creates parking slots with specified capacity
func (app *application) CreateParking(c *gin.Context) {
	var request struct {
		Capacity int `json:"capacity" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if request.Capacity <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Capacity must be greater than 0"})
		return
	}

	err := app.models.Parking_slots.Insert(request.Capacity)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create parking slots"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message":  "Parking lot created successfully",
		"capacity": request.Capacity,
	})
}

// ParkCar assigns a car to the nearest available parking slot
func (app *application) ParkCar(c *gin.Context) {
	var request struct {
		CarNumber string `json:"car_number" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if car is already parked
	existingSlot, err := app.models.Parking_slots.GetByCarNumber(request.CarNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to check car status"})
		return
	}

	if existingSlot != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Car is already parked in slot " + string(rune(existingSlot.Id))})
		return
	}

	// Find available slot
	slot, err := app.models.Parking_slots.GetAvailableSlot()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find available slot"})
		return
	}

	if slot == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Sorry, parking lot is full"})
		return
	}

	// Park the car
	err = app.models.Parking_slots.Park(slot.Id, request.CarNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to park car"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":     "Car parked successfully",
		"slot_number": slot.Id,
		"car_number":  request.CarNumber,
	})
}

// LeaveCar handles car checkout and calculates charges
func (app *application) LeaveCar(c *gin.Context) {
	var request struct {
		CarNumber string `json:"car_number" binding:"required"`
	}

	if err := c.ShouldBindJSON(&request); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Find the parked car
	slot, err := app.models.Parking_slots.GetByCarNumber(request.CarNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find car"})
		return
	}

	if slot == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Registration number " + request.CarNumber + " not found"})
		return
	}

	// Calculate charge
	hours, charge, err := database.CalculateCharge(slot.Start_time)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to calculate charge"})
		return
	}

	// Create history record
	history := &database.Parking_history{
		Car_number: slot.Car_number,
		Slot_id:    slot.Id,
		Start_time: slot.Start_time,
		End_time:   time.Now().Format(time.RFC3339),
		Hours:      hours,
		Charge:     charge,
	}

	err = app.models.Parking_history.Insert(history)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save parking history"})
		return
	}

	// Free up the slot
	err = app.models.Parking_slots.Leave(slot.Id)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to free parking slot"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":             "Car left successfully",
		"registration_number": request.CarNumber,
		"slot_number":         slot.Id,
		"hours":               hours,
		"charge":              charge,
	})
}

// ParkingStatus shows the current status of all parking slots
func (app *application) ParkingStatus(c *gin.Context) {
	slots, err := app.models.Parking_slots.GetAll()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get parking status"})
		return
	}

	var response []gin.H
	for _, slot := range slots {
		status := gin.H{
			"slot_no": slot.Id,
		}

		if slot.Is_available {
			status["status"] = "Available"
		} else {
			status["status"] = "Occupied"
			status["registration_no"] = slot.Car_number
		}

		response = append(response, status)
	}

	c.JSON(http.StatusOK, gin.H{
		"parking_slots": response,
		"total_slots":   len(slots),
	})
}

// GetSlotByCar finds which slot a car is parked in
func (app *application) GetSlotByCar(c *gin.Context) {
	carNumber := c.Param("car_number")

	slot, err := app.models.Parking_slots.GetByCarNumber(carNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to find car"})
		return
	}

	if slot == nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Registration number " + carNumber + " not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"car_number":  slot.Car_number,
		"slot_number": slot.Id,
		"start_time":  slot.Start_time,
	})
}

// GetHistory retrieves parking history for a specific car
func (app *application) GetHistory(c *gin.Context) {
	carNumber := c.Param("car_number")

	histories, err := app.models.Parking_history.GetByCarNumber(carNumber)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get parking history"})
		return
	}

	if len(histories) == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "No parking history found for " + carNumber})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"car_number": carNumber,
		"history":    histories,
	})
}
