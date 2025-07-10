#!/bin/bash

# Start both frontend and backend servers for Techtoniq development

echo "🚀 Starting Techtoniq development servers..."
echo "Frontend: http://localhost:3000"
echo "Backend API: http://localhost:3001/api"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Run both servers concurrently
npm run dev-full
