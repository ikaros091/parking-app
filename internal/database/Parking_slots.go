package database

import (
	"database/sql"
	"time"
)

type Parking_slotsModel struct {
	DB *sql.DB
}

type Parking_slots struct {
	Id           int    `json:"id"`
	Car_number   string `json:"car_number"`
	Start_time   string `json:"start_time"`
	Is_available bool   `json:"is_available"`
}

// Insert creates new parking slots
func (m *Parking_slotsModel) Insert(capacity int) error {
	query := `INSERT INTO parking_slots (car_number, start_time, is_available) VALUES (?, ?, ?)`

	for i := 1; i <= capacity; i++ {
		_, err := m.DB.Exec(query, "", time.Now().Format(time.RFC3339), true)
		if err != nil {
			return err
		}
	}
	return nil
}

// GetAvailableSlot finds the first available slot
func (m *Parking_slotsModel) GetAvailableSlot() (*Parking_slots, error) {
	query := `SELECT id, car_number, start_time, is_available FROM parking_slots WHERE is_available = true ORDER BY id LIMIT 1`

	var slot Parking_slots
	err := m.DB.QueryRow(query).Scan(&slot.Id, &slot.Car_number, &slot.Start_time, &slot.Is_available)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &slot, nil
}

// Park assigns a car to a slot
func (m *Parking_slotsModel) Park(slotId int, carNumber string) error {
	query := `UPDATE parking_slots SET car_number = ?, start_time = ?, is_available = false WHERE id = ?`

	_, err := m.DB.Exec(query, carNumber, time.Now().Format(time.RFC3339), slotId)
	return err
}

// Leave frees up a parking slot
func (m *Parking_slotsModel) Leave(slotId int) error {
	query := `UPDATE parking_slots SET car_number = '', is_available = true WHERE id = ?`

	_, err := m.DB.Exec(query, slotId)
	return err
}

// Get retrieves a slot by ID
func (m *Parking_slotsModel) Get(id int) (*Parking_slots, error) {
	query := `SELECT id, car_number, start_time, is_available FROM parking_slots WHERE id = ?`

	var slot Parking_slots
	err := m.DB.QueryRow(query, id).Scan(&slot.Id, &slot.Car_number, &slot.Start_time, &slot.Is_available)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &slot, nil
}

// GetByCarNumber finds a slot by car registration number
func (m *Parking_slotsModel) GetByCarNumber(carNumber string) (*Parking_slots, error) {
	query := `SELECT id, car_number, start_time, is_available FROM parking_slots WHERE car_number = ? AND is_available = false`

	var slot Parking_slots
	err := m.DB.QueryRow(query, carNumber).Scan(&slot.Id, &slot.Car_number, &slot.Start_time, &slot.Is_available)

	if err == sql.ErrNoRows {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}

	return &slot, nil
}

// GetAll retrieves all parking slots
func (m *Parking_slotsModel) GetAll() ([]*Parking_slots, error) {
	query := `SELECT id, car_number, start_time, is_available FROM parking_slots ORDER BY id`

	rows, err := m.DB.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var slots []*Parking_slots
	for rows.Next() {
		var slot Parking_slots
		err := rows.Scan(&slot.Id, &slot.Car_number, &slot.Start_time, &slot.Is_available)
		if err != nil {
			return nil, err
		}
		slots = append(slots, &slot)
	}

	return slots, nil
}
