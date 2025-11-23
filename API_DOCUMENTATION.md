# Parking App API Documentation

## Base URL
```
http://localhost:3000/api/v1
```

## Endpoints

### 1. Create Parking Lot
**POST** `/parking/create`

Membuat parking lot dengan kapasitas tertentu.

**Request Body:**
```json
{
  "capacity": 6
}
```

**Response:**
```json
{
  "message": "Parking lot created successfully",
  "capacity": 6
}
```

---

### 2. Park Car
**POST** `/parking/park`

Parkir mobil ke slot yang tersedia (slot terdekat dari entry).

**Request Body:**
```json
{
  "car_number": "KA-01-HH-1234"
}
```

**Response:**
```json
{
  "message": "Car parked successfully",
  "slot_number": 1,
  "car_number": "KA-01-HH-1234"
}
```

**Error Response (Parking Full):**
```json
{
  "error": "Sorry, parking lot is full"
}
```

---

### 3. Leave Parking (Check Out)
**POST** `/parking/leave`

Mobil keluar dari parking lot dan menghitung biaya parkir.

**Request Body:**
```json
{
  "car_number": "KA-01-HH-1234"
}
```

**Response:**
```json
{
  "message": "Car left successfully",
  "registration_number": "KA-01-HH-1234",
  "slot_number": 1,
  "hours": 4,
  "charge": 30
}
```

**Charging Rules:**
- $10 untuk 2 jam pertama
- $10 untuk setiap jam tambahan

---

### 4. Get Parking Status
**GET** `/parking/status`

Melihat status semua slot parkir.

**Response:**
```json
{
  "parking_slots": [
    {
      "slot_no": 1,
      "status": "Occupied",
      "registration_no": "KA-01-HH-1234"
    },
    {
      "slot_no": 2,
      "status": "Available"
    }
  ],
  "total_slots": 6
}
```

---

### 5. Get Slot by Car Number
**GET** `/parking/slot/:car_number`

Mencari slot parkir berdasarkan nomor registrasi mobil.

**Example:**
```
GET /parking/slot/KA-01-HH-1234
```

**Response:**
```json
{
  "car_number": "KA-01-HH-1234",
  "slot_number": 1,
  "start_time": "2025-11-23T15:30:00Z"
}
```

**Error Response:**
```json
{
  "error": "Registration number KA-01-HH-1234 not found"
}
```

---

### 6. Get Parking History
**GET** `/parking/history/:car_number`

Melihat riwayat parkir untuk mobil tertentu.

**Example:**
```
GET /parking/history/KA-01-HH-1234
```

**Response:**
```json
{
  "car_number": "KA-01-HH-1234",
  "history": [
    {
      "id": 1,
      "car_number": "KA-01-HH-1234",
      "slot_id": 1,
      "start_time": "2025-11-23T15:30:00Z",
      "end_time": "2025-11-23T19:30:00Z",
      "hours": 4,
      "charge": 30
    }
  ]
}
```

---

## Testing with cURL

### Create Parking Lot
```bash
curl -X POST http://localhost:3000/api/v1/parking/create \
  -H "Content-Type: application/json" \
  -d '{"capacity": 6}'
```

### Park a Car
```bash
curl -X POST http://localhost:3000/api/v1/parking/park \
  -H "Content-Type: application/json" \
  -d '{"car_number": "KA-01-HH-1234"}'
```

### Leave Parking
```bash
curl -X POST http://localhost:3000/api/v1/parking/leave \
  -H "Content-Type: application/json" \
  -d '{"car_number": "KA-01-HH-1234"}'
```

### Get Status
```bash
curl http://localhost:3000/api/v1/parking/status
```

### Find Car Slot
```bash
curl http://localhost:3000/api/v1/parking/slot/KA-01-HH-1234
```

### Get History
```bash
curl http://localhost:3000/api/v1/parking/history/KA-01-HH-1234
```

---

## Running the Application

1. **Run Migrations:**
```bash
go run ./cmd/migrate/main.go up
```

2. **Start Server:**
```bash
go run ./cmd/api/main.go ./cmd/api/Parking.go ./cmd/api/route.go ./cmd/api/server.go
```

Or use Air for hot reload:
```bash
air
```

3. **Server will start on:**
```
http://localhost:3000
```
