#!/bin/bash
set -e

echo "🚀 Starting dependency installation..."

# Clean up any existing node_modules and lock files
echo "🧹 Cleaning up existing dependencies..."
rm -rf node_modules package-lock.json .next .vercel

# Install production dependencies
echo "📦 Installing production dependencies..."
npm install --production=false

# Install development dependencies
echo "🔧 Installing development dependencies..."
npm install --save-dev @types/node @types/react @types/react-dom @vitejs/plugin-react vite-plugin-pwa mongodb @types/mongodb

echo "✅ Dependencies installed successfully!"
echo "\nNext steps:"
echo "1. Create a .env.local file based on .env.example"
echo "2. Update the MONGODB_URI with your actual MongoDB connection string"
echo "3. Run 'npm run dev' to start the development server\n"
