#!/bin/bash

echo "🔍 Checking Environment Variables Configuration"
echo "=============================================="

echo "1. Check if Vercel CLI is installed..."
if command -v vercel &> /dev/null; then
    echo "✅ Vercel CLI is installed"
    echo "2. You can check your environment variables with:"
    echo "   vercel env ls"
    echo ""
    echo "3. Or view them in the Vercel dashboard:"
    echo "   https://vercel.com/dashboard/[your-project]/settings/environment-variables"
else
    echo "❌ Vercel CLI not installed"
    echo "   Install with: npm i -g vercel"
fi

echo ""
echo "📋 Required Environment Variables:"
echo "   SUPABASE_URL=https://wqsuuxgpbgsipnbzzjms.supabase.co"
echo "   SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc3V1eGdwYmdzaXBuYnp6am1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA2MTQwMCwiZXhwIjoyMDY3NjM3NDAwfQ.BQMIAKeuVKqRuHnRps_AzY1xhXxJ22u9iA_TzcQ0KZw"
echo ""
echo "💡 Since SUPABASE_SERVICE_KEY already exists, you likely just need to:"
echo "   1. Update its value to the one above"
echo "   2. Add SUPABASE_URL if it doesn't exist"
echo "   3. Redeploy your project" 