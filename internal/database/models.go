package database

import "database/sql"

type Models struct {
	Parking_slots   Parking_slotsModel
	Parking_history Parking_historyModel
}

func NewModels(db *sql.DB) Models {
	return Models{
		Parking_slots: Parking_slotsModel{DB: db},
		Parking_history: Parking_historyModel{DB: db},
	}
}