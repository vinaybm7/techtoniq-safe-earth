#!/bin/bash
set -e

echo "🚀 Starting installation with fixes..."

# Clean up existing dependencies
echo "🧹 Cleaning up existing dependencies..."
rm -rf node_modules package-lock.json .next .vercel

# Install specific versions of Vercel packages
echo "📦 Installing Vercel packages..."
npm install --save-dev @vercel/build-utils@6.8.0 @vercel/node@4.0.0

# Install other production and development dependencies
echo "📦 Installing other dependencies..."
npm install --production=false

# Install TypeScript types
echo "🔧 Installing TypeScript types..."
npm install --save-dev @types/node @types/react @types/react-dom @types/mongodb

# Install Vite and React plugins
echo "⚡ Installing Vite and React plugins..."
npm install --save-dev @vitejs/plugin-react vite-plugin-pwa

echo "✅ Installation completed successfully!"
echo "\nNext steps:"
echo "1. Create a .env.local file based on .env.example"
echo "2. Update the MONGODB_URI with your actual MongoDB connection string"
echo "3. Run 'npm run dev' to start the development server\n"
