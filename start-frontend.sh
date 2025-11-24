#!/bin/bash

echo "🚗 Starting 3D Parking Management System..."
echo ""

# Check if backend is needed
echo "📦 Step 1: Installing frontend dependencies..."
cd "parking app"
npm install @react-three/fiber @react-three/drei axios

echo ""
echo "✅ Dependencies installed!"
echo ""
echo "🚀 Step 2: Starting frontend server..."
echo "Frontend will run at: http://localhost:5173"
echo ""
echo "⚠️  Make sure backend is running at http://localhost:3000"
echo ""

npm run dev
