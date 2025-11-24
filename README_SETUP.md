# 🚗 3D Parking Management System - Setup Complete!

## ✅ Yang Sudah Dibuat

### Backend (Go + Gin + SQLite)
- ✅ API endpoints lengkap
- ✅ Database models dengan migrations
- ✅ CORS support untuk frontend
- ✅ Pure Go SQLite driver (no CGO needed)

### Frontend (React + Vite + Three.js)
- ✅ 3D isometric parking lot view
- ✅ Interactive 3D car models
- ✅ Real-time status updates
- ✅ Modal popups untuk park/leave
- ✅ Responsive UI dengan gradient theme

## 🚀 Cara Menjalankan

### 1. Start Backend (Terminal 1)

```bash
# Di root folder parking-app
go run ./cmd/api/main.go ./cmd/api/Parking.go ./cmd/api/route.go ./cmd/api/server.go
```

Backend akan running di: `http://localhost:3000`

### 2. Install Frontend Dependencies (Terminal 2 - Bash)

```bash
cd "parking app"
npm install @react-three/fiber @react-three/drei axios
```

**Note:** Gunakan Git Bash atau WSL karena PowerShell memiliki execution policy restriction.

### 3. Start Frontend (Terminal 2)

```bash
npm run dev
```

Frontend akan running di: `http://localhost:5173`

## 🎮 Cara Menggunakan

### Step 1: Buat Parking Lot
1. Masukkan kapasitas (misalnya: 6)
2. Klik tombol **"🏗️ Create Parking Lot"**
3. Slot parkir akan muncul dalam tampilan 3D

### Step 2: Parkir Mobil
1. Klik tombol **"🚗 Park Car"**
2. Masukkan nomor plat (contoh: `KA-01-HH-1234`)
3. Mobil 3D akan muncul di slot terdekat dari entry

### Step 3: Lihat Status
- Header menampilkan real-time statistics:
  - Total Slots
  - Available
  - Occupied

### Step 4: Klik Mobil untuk Detail
1. Klik mobil yang sudah parkir (mobil 3D merah)
2. Popup akan menampilkan:
   - Slot number
   - Registration number
   - Status
3. Klik **"🚪 Leave Parking"** untuk checkout

### Step 5: Sistem Menghitung Biaya
- $10 untuk 2 jam pertama
- $10 untuk setiap jam tambahan
- Biaya ditampilkan saat mobil checkout

## 🎨 Fitur 3D View

### Kontrol Kamera:
- **Rotate**: Drag dengan mouse kiri
- **Zoom**: Scroll mouse wheel
- **Pan**: Drag dengan mouse kanan

### Interaksi:
- **Hover slot kosong**: Slot berubah warna biru
- **Hover mobil**: Mobil berubah warna lebih terang
- **Click slot kosong**: Buka dialog park car
- **Click mobil**: Tampilkan detail & button leave

## 📁 Struktur File

```
parking-app/
├── cmd/
│   ├── api/
│   │   ├── main.go           # Entry point
│   │   ├── Parking.go        # Handler functions
│   │   ├── route.go          # Routes + CORS
│   │   └── server.go         # HTTP server
│   └── migrate/
│       └── main.go           # Database migrations
├── internal/
│   └── database/
│       ├── models.go         # Database models
│       ├── Parking_slots.go  # Slot operations
│       └── Parking_history.go # History operations
├── parking app/              # Frontend
│   ├── src/
│   │   ├── components/
│   │   │   └── ParkingLot3D.jsx  # 3D scene
│   │   ├── services/
│   │   │   └── api.js        # API client
│   │   ├── App.jsx           # Main component
│   │   ├── App.css           # Styles
│   │   └── index.css         # Global styles
│   └── package.json
└── data.db                   # SQLite database
```

## 🎯 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/parking/create` | Create parking lot |
| POST | `/api/v1/parking/park` | Park a car |
| POST | `/api/v1/parking/leave` | Leave parking |
| GET | `/api/v1/parking/status` | Get all slots status |
| GET | `/api/v1/parking/slot/:car_number` | Find car slot |
| GET | `/api/v1/parking/history/:car_number` | Get parking history |

## 🐛 Troubleshooting

### PowerShell Execution Policy Error
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```
Atau gunakan Git Bash / WSL.

### CORS Error
CORS sudah di-setup di `route.go`. Pastikan backend sudah running.

### Port Already in Use
- Backend (3000): Matikan aplikasi lain yang menggunakan port 3000
- Frontend (5173): Matikan dev server lain atau ubah port di `vite.config.js`

## 🎨 Customization

### Ubah Warna Mobil
Edit di `ParkingLot3D.jsx`:
```jsx
<Car color="#ff6b6b" ... />
```

### Ubah Layout Slot
Edit di `ParkingLot3D.jsx`:
```jsx
const slotsPerRow = 3;      // Ubah jumlah slot per baris
const slotSpacingX = 3;     // Ubah jarak horizontal
const slotSpacingZ = 4;     // Ubah jarak vertikal
```

### Ubah Camera View
Edit di `ParkingLot3D.jsx`:
```jsx
camera={{ position: [0, 12, 15], fov: 50 }}
```

## 📝 Testing Examples

### Contoh Nomor Plat:
- KA-01-HH-1234
- KA-01-HH-9999
- KA-01-BB-0001
- DL-12-AA-9999
- CA-09-IO-1111

Selamat menggunakan! 🎉
