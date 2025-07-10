# 🚀 Techtoniq Production Deployment Guide

## Quick Deploy to Vercel

### 1. Prerequisites
- [Vercel account](https://vercel.com)
- [GitHub account](https://github.com) 
- Google Gemini API key (optional for AI features)

### 2. Deploy Steps

#### Option A: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/git/external?repository-url=https://github.com/vinaybm7/techtoniq-safe-earth)

#### Option B: Manual Deploy
1. **Fork/Clone Repository**
   ```bash
   git clone https://github.com/vinaybm7/techtoniq-safe-earth.git
   cd techtoniq-safe-earth
   ```

2. **Connect to Vercel**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Select "techtoniq-safe-earth"

3. **Configure Environment Variables**
   In Vercel project settings, add:
   ```
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Deploy**
   - Click "Deploy"
   - Vercel will automatically build and deploy your app

### 3. Verify Deployment

After deployment, test these endpoints:

- **Main App**: `https://your-app.vercel.app`
- **Subscription API**: `https://your-app.vercel.app/api/subscribe`
- **Health Check**: 
  ```bash
  curl https://your-app.vercel.app/api/subscribe
  # Should return: {"status":"ok","message":"Techtoniq Subscription API is running"}
  ```

### 4. Test Subscription Form

```bash
curl -X POST https://your-app.vercel.app/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

Expected response:
```json
{
  "success": true,
  "message": "Successfully subscribed to earthquake alerts!",
  "data": {
    "email": "test@example.com",
    "subscribed_at": "2025-01-10T08:47:32.000Z"
  }
}
```

## Alternative Deployment Platforms

### Netlify
1. **Connect Repository**
   - Go to [Netlify](https://netlify.com)
   - Click "New site from Git"
   - Connect your repository

2. **Build Settings**
   ```
   Build command: npm run build
   Publish directory: dist
   ```

3. **Environment Variables**
   ```
   VITE_GEMINI_API_KEY=your_google_gemini_api_key_here
   ```

4. **Functions**
   - Copy `api/subscribe.ts` to `netlify/functions/subscribe.ts`
   - Update paths as needed for Netlify Functions

## Features in Production

### ✅ Working Features
- 🌐 **Frontend**: React app with Vite build
- 📧 **Subscription API**: Serverless function on `/api/subscribe`
- 🗄️ **Database**: Supabase PostgreSQL (cloud-hosted)
- 🔄 **Real-time Data**: USGS earthquake API integration
- 🤖 **AI Predictions**: Google Gemini API integration (with key)
- 📱 **PWA**: Progressive Web App capabilities
- 🎨 **UI**: Responsive design with Tailwind CSS

### 🔧 Configuration Details

#### API Architecture
```
Frontend (Vercel Static)
    ↓
/api/subscribe (Vercel Serverless Function)
    ↓
Supabase Database (Cloud PostgreSQL)
```

#### Environment Variables
- **Development**: Uses proxy to localhost:3001
- **Production**: Uses `/api/*` routes handled by Vercel Functions

#### Database Schema
```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  subscription_type VARCHAR(100) DEFAULT 'earthquake_alerts',
  is_active BOOLEAN DEFAULT true
);
```

## Monitoring & Maintenance

### Health Checks
- **API Health**: `GET /api/subscribe`
- **Frontend**: Check main app loads
- **Database**: Subscription form test

### Logs
- **Vercel**: Check function logs in Vercel dashboard
- **Supabase**: Monitor database queries in Supabase dashboard

### Updates
```bash
git pull origin main
# Vercel automatically redeploys on git push
```

## Troubleshooting

### Common Issues

1. **Subscription API Returns 404**
   - Check `vercel.json` routing configuration
   - Ensure `api/subscribe.ts` exists
   - Verify Vercel build logs

2. **CORS Errors**
   - Check API function includes CORS headers
   - Verify domain in Supabase settings

3. **Database Connection Issues**
   - Verify Supabase credentials
   - Check database table exists
   - Review Supabase logs

4. **Build Failures**
   - Check Node.js version (18.x required)
   - Verify all dependencies in package.json
   - Review Vercel build logs

### Support
- **Vercel Docs**: https://vercel.com/docs
- **Supabase Docs**: https://supabase.com/docs
- **Project Issues**: Create GitHub issue in repository
