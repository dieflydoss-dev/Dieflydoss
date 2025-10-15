#!/bin/bash

# Vegas Insider Sports App - Netlify Deployment Script
echo "🏈 Deploying Vegas Insider Sports App to Netlify..."

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

echo "✅ Node.js and npm are installed"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed successfully"

# Build the project
echo "🔨 Building the project..."
npm run build:simple

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully"

# Check if dist folder exists
if [ ! -d "dist" ]; then
    echo "❌ dist folder not found"
    exit 1
fi

echo "✅ dist folder created"

# Check if Netlify CLI is installed
if ! command -v netlify &> /dev/null; then
    echo "📥 Installing Netlify CLI..."
    npm install -g netlify-cli
fi

echo "✅ Netlify CLI is ready"

# Deploy to Netlify
echo "🚀 Deploying to Netlify..."
echo ""
echo "Choose deployment option:"
echo "1. Deploy to production (requires login)"
echo "2. Create draft deploy"
echo "3. Manual instructions"
echo ""
read -p "Enter your choice (1-3): " choice

case $choice in
    1)
        echo "🔐 Please login to Netlify..."
        netlify login
        echo "🚀 Deploying to production..."
        netlify deploy --prod --dir=dist
        ;;
    2)
        echo "📝 Creating draft deploy..."
        netlify deploy --dir=dist
        ;;
    3)
        echo ""
        echo "📋 Manual Deployment Instructions:"
        echo ""
        echo "1. Go to https://netlify.com and sign in"
        echo "2. Drag and drop the 'dist' folder to deploy"
        echo "3. Or connect your Git repository for auto-deploys"
        echo ""
        echo "Build settings:"
        echo "- Build command: npm run build:simple"
        echo "- Publish directory: dist"
        echo "- Node version: 18"
        echo ""
        ;;
    *)
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "🎉 Deployment process completed!"
echo ""
echo "📱 Your Vegas Insider Sports App features:"
echo "🔥 Hot Streaks Tracker"
echo "📈 Line Watch Tool"
echo "📊 Odds Analyzer Dashboard"
echo "💰 My Bet Vault"
echo "📱 Team Pulse Widget"
echo "🍎 Apple Wallet Integration"
echo ""
echo "🌐 Your app is now live on Netlify!"