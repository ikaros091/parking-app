package database

import (
	"database/sql"
	"time"
)

type Parking_historyModel struct {
	DB *sql.DB
}

type Parking_history struct {
	Id         int    `json:"id"`
	Car_number string `json:"car_number"`
	Slot_id    int    `json:"slot_id" binding:"required"`
	Start_time string `json:"start_time"`
	End_time   string `json:"end_time"`
	Hours      int    `json:"hours"`
	Charge     int    `json:"charge"`
}

// Insert creates a new parking history record
func (m *Parking_historyModel) Insert(history *Parking_history) error {
	query := `INSERT INTO parking_history (car_number, slot_id, start_time, end_time, hours, charge) 
			  VALUES (?, ?, ?, ?, ?, ?)`

	result, err := m.DB.Exec(query,
		history.Car_number,
		history.Slot_id,
		history.Start_time,
		history.End_time,
		history.Hours,
		history.Charge)

	if err != nil {
		return err
	}

	id, err := result.LastInsertId()
	if err != nil {
		return err
	}

	history.Id = int(id)
	return nil
}

// GetByCarNumber retrieves parking history for a specific car
func (m *Parking_historyModel) GetByCarNumber(carNumber string) ([]*Parking_history, error) {
	query := `SELECT id, car_number, slot_id, start_time, end_time, hours, charge 
			  FROM parking_history WHERE car_number = ? ORDER BY id DESC`

	rows, err := m.DB.Query(query, carNumber)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var histories []*Parking_history
	for rows.Next() {
		var history Parking_history
		err := rows.Scan(
			&history.Id,
			&history.Car_number,
			&history.Slot_id,
			&history.Start_time,
			&history.End_time,
			&history.Hours,
			&history.Charge)
		if err != nil {
			return nil, err
		}
		histories = append(histories, &history)
	}

	return histories, nil
}

// CalculateCharge calculates parking charge based on hours
func CalculateCharge(startTime string) (int, int, error) {
	start, err := time.Parse(time.RFC3339, startTime)
	if err != nil {
		return 0, 0, err
	}

	duration := time.Since(start)
	hours := int(duration.Hours())
	if duration.Minutes() > float64(hours*60) {
		hours++
	}

	// $10 for first 2 hours, $10 for every additional hour
	var charge int
	if hours <= 2 {
		charge = 10
	} else {
		charge = 10 + ((hours - 2) * 10)
	}

	return hours, charge, nil
}
