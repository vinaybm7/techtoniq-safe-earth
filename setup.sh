#!/bin/bash
set -e

# Clean up existing dependencies
echo "🚀 Starting project setup..."
./cleanup.sh

# Install Node.js dependencies using the correct Node version
echo "📦 Installing Node.js dependencies..."
npm install --legacy-peer-deps

# Build the project
echo "🔨 Building the project..."
npm run build

echo "✅ Setup complete! You can now run the development server with 'npm run dev'"
