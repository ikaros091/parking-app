@echo off
echo Starting 3D Parking Management System Backend...
echo.
echo Backend will run at: http://localhost:3000
echo.

go run ./cmd/api/main.go ./cmd/api/Parking.go ./cmd/api/route.go ./cmd/api/server.go
