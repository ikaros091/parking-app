CREATE TABLE IF NOT EXISTS parking_slots (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    car_number VARCHAR NOT NULL,
    start_time TIMESTAMP NOT NULL,
    is_available BOOLEAN NOT null
)