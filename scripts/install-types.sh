#!/bin/bash
set -e

echo "Installing TypeScript types..."

# Install Next.js types and MongoDB driver
yarn add --dev @types/node @types/react @types/react-dom @types/mongodb

# Install Next.js if not already installed
if ! grep -q "next" package.json; then
  echo "Installing Next.js..."
  yarn add next
fi

echo "TypeScript types installed successfully!"
