# 🚀 Techtoniq Development Guide

## Quick Start

### Running the Application

The Techtoniq application requires both a frontend (React/Vite) and backend (Express) server to be running simultaneously for full functionality.

#### Option 1: Use the Start Script (Recommended)
```bash
./start-dev.sh
```

#### Option 2: Manual Start
```bash
# Terminal 1: Start frontend (Vite dev server)
npm run dev

# Terminal 2: Start backend (Express API server)
npm run server
```

#### Option 3: Single Command
```bash
npm run dev-full
```

## Server Details

- **Frontend**: http://localhost:3000 (Vite development server)
- **Backend API**: http://localhost:3001/api (Express server)

## API Endpoints

### Subscription API
- **POST** `/api/subscribe` - Subscribe to earthquake alerts
- **Example**:
  ```bash
  curl -X POST http://localhost:3001/api/subscribe \
    -H "Content-Type: application/json" \
    -d '{"email":"user@example.com"}'
  ```

### Fault Lines API
- **GET** `/api/fault-lines?lat={latitude}&lng={longitude}&radius={km}` - Get nearby fault lines

## Troubleshooting

### Subscription Form Error: "No response from server"

**Root Cause**: The backend Express server (port 3001) is not running.

**Solution**: 
1. Make sure both servers are running using `npm run dev-full` or `./start-dev.sh`
2. Check that port 3001 is available and not blocked by firewall
3. Verify the backend server shows "Server running on port 3001" message

### Port Already in Use

```bash
# Kill processes on specific ports
lsof -ti:3000 | xargs kill -9  # Frontend
lsof -ti:3001 | xargs kill -9  # Backend

# Or restart the servers
npm run dev-full
```

## Environment Variables

Create a `.env` file in the root directory:

```env
# Required for AI earthquake predictions
VITE_GEMINI_API_KEY=your_google_gemini_api_key_here

# Optional: API base URL (automatically configured by Vite)
# VITE_API_BASE_URL=http://localhost:3001/api
```

## Architecture Overview

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express.js + Supabase (PostgreSQL)
- **APIs**: USGS Earthquake API, Google Gemini AI, GNews.io
- **Real-time Data**: Auto-refresh every 5 minutes
- **Database**: Supabase for user subscriptions

## Production Deployment

The application is configured for deployment on:
- **Frontend**: Vercel/Netlify (static hosting)
- **Backend**: Serverless functions (Vercel Functions/Netlify Functions)
- **Database**: Supabase cloud PostgreSQL

For production builds:
```bash
npm run build
npm run start  # Starts production server
```
