CREATE TABLE IF NOT EXISTS parking_history (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_number VARCHAR NOT NULL,
    slot_id INTEGER NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time TIMESTAMP,
    hours INTEGER,
    charge INTEGER,
    FOREIGN KEY (slot_id) REFERENCES parking_slots(id)
);