# Frontend Setup Instructions

## Install Dependencies

Buka terminal **bash** (bukan PowerShell) di folder `parking app`:

```bash
cd "parking app"
npm install @react-three/fiber @react-three/drei axios
```

## Run Development Server

```bash
npm run dev
```

Server akan berjalan di: `http://localhost:5173`

## Dependencies yang Dibutuhkan

- `@react-three/fiber` - React wrapper untuk Three.js
- `@react-three/drei` - Helper components untuk R3F
- `axios` - HTTP client untuk API calls
- `three` - Three.js (sudah terinstall)

## Cara Menggunakan

1. **Pastikan Backend API berjalan** di `http://localhost:3000`
   ```bash
   go run ./cmd/api/main.go ./cmd/api/Parking.go ./cmd/api/route.go ./cmd/api/server.go
   ```

2. **Jalankan Frontend**
   ```bash
   cd "parking app"
   npm run dev
   ```

3. **Buka browser** di `http://localhost:5173`

## Fitur yang Tersedia

### 1. Create Parking Lot
- Input jumlah kapasitas slot
- Klik tombol "Create Parking Lot"
- Slot akan muncul dalam tampilan 3D isometric

### 2. Park Car
- Klik tombol "Park Car"
- Masukkan nomor registrasi mobil (contoh: KA-01-HH-1234)
- Mobil 3D akan muncul di slot terdekat

### 3. View Status
- Lihat real-time status di header:
  - Total Slots
  - Available
  - Occupied

### 4. Car Details
- Klik mobil yang sudah parkir
- Popup akan menampilkan:
  - Slot Number
  - Car Number
  - Status
  - Button "Leave Parking"

### 5. Leave Parking
- Klik mobil yang parkir
- Klik button "Leave Parking"
- Sistem akan calculate biaya dan menampilkan:
  - Total hours
  - Total charge ($10 untuk 2 jam pertama, $10/jam tambahan)

## Kontrol 3D View

- **Rotate**: Klik kiri + drag
- **Zoom**: Scroll mouse
- **Pan**: Klik kanan + drag (atau klik tengah)

## Troubleshooting

### Jika npm tidak bisa dijalankan di PowerShell:
```bash
# Gunakan Git Bash atau WSL
# Atau set execution policy:
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### CORS Error:
Pastikan backend Go API sudah setup CORS. Tambahkan di `cmd/api/server.go` atau `route.go`:

```go
import "github.com/gin-contrib/cors"

// Di routes():
g.Use(cors.Default())
```

Install CORS middleware:
```bash
go get github.com/gin-contrib/cors
```
