#!/bin/bash

# TaskFlow Startup Script
echo "🚀 Starting TaskFlow - Modern Task Management App"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "📦 Installing dependencies..."

# Install backend dependencies
echo "🔧 Installing backend dependencies..."
npm install

# Install frontend dependencies
echo "🎨 Installing frontend dependencies..."
cd client && npm install
cd ..

echo "✅ Dependencies installed successfully!"
echo ""
echo "🌟 Starting development servers..."
echo "   - Backend: http://localhost:5000"
echo "   - Frontend: http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop the servers"
echo ""

# Start both servers
npm run dev