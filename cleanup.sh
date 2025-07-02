#!/bin/bash

# Remove node_modules and lock files
rm -rf node_modules
rm -f package-lock.json
rm -f pnpm-lock.yaml
rm -f yarn.lock

# Clear npm cache
npm cache clean --force

# Remove any Vercel specific caches
rm -rf .vercel
rm -rf .next

# Remove build artifacts
rm -rf dist
rm -rf .vite

echo "✅ Cleanup complete! You can now run 'npm install' to reinstall dependencies."
