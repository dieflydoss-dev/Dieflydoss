#!/bin/bash

echo "🏈 Building Vegas Insider Sports App for Web..."

# Use the simplified package.json for web
cp package-web.json package.json

echo "📦 Installing web dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "🔨 Building for production..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build completed successfully!"
echo "📁 Output directory: dist/"
echo "🌐 Ready for deployment!"