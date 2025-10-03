#!/bin/bash

# GreenReach Ads - Run Script
# This script sets up and runs the GreenReach Ads application

echo "🌱 GreenReach Ads - Starting Application Setup"
echo "=============================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 20.19+ or 22.12+"
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2)
echo "📦 Node.js version: $NODE_VERSION"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm"
    exit 1
fi

echo "📦 npm version: $(npm -v)"

# Install dependencies
echo ""
echo "🔧 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the application
echo ""
echo "🏗️  Building application..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Application built successfully"

# Start the development server
echo ""
echo "🚀 Starting development server..."
echo "   The application will be available at: http://localhost:5173"
echo "   Press Ctrl+C to stop the server"
echo ""

# Try to open the browser (works on macOS and some Linux distributions)
if command -v open &> /dev/null; then
    # macOS
    (sleep 3 && open http://localhost:5173) &
elif command -v xdg-open &> /dev/null; then
    # Linux
    (sleep 3 && xdg-open http://localhost:5173) &
fi

# Start the development server
npm run dev
