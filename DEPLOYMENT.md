# Techtoniq Deployment Guide

## Environment Variables Setup

To ensure the subscription system works properly in production with Supabase, you need to set the following environment variables in your Vercel deployment:

### Required Environment Variables

1. **SUPABASE_URL**
   - Value: `https://wqsuuxgpbgsipnbzzjms.supabase.co`
   - Description: Your Supabase project URL

2. **SUPABASE_SERVICE_KEY**
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc3V1eGdwYmdzaXBuYnp6am1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA2MTQwMCwiZXhwIjoyMDY3NjM3NDAwfQ.BQMIAKeuVKqRuHnRps_AzY1xhXxJ22u9iA_TzcQ0KZw`
   - Description: Your Supabase service role key for server-side operations

### How to Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your Techtoniq project
3. Go to Settings > Environment Variables
4. Add the two variables above
5. Deploy the project again

### Supabase Table Structure

Make sure you have a `subscriptions` table in your Supabase database with the following structure:

```sql
CREATE TABLE subscriptions (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### API Endpoints

- **POST /api/subscribe** - Subscribe an email address
- **GET /api/subscribe** - Health check endpoint

### Testing the Deployment

1. Deploy to Vercel with the environment variables set
2. Test the subscription form at `/subscribe`
3. Check the Vercel function logs to ensure Supabase connection is working
4. Verify emails are being stored in your Supabase database

### Fallback Mechanism

The system includes a fallback to in-memory storage if Supabase is not available, ensuring the subscription form always works.
