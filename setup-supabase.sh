#!/bin/bash

echo "🚀 Setting up Supabase Environment Variables for Vercel"
echo "=================================================="

# Check if user has Supabase credentials
echo ""
echo "📋 You will need the following from your Supabase project:"
echo "   1. Project URL (found in Project Settings > API)"
echo "   2. Service Role Key (found in Project Settings > API > service_role secret)"
echo ""
echo "⚠️  WARNING: Use the SERVICE ROLE key (not the anon key) for write operations!"
echo ""

# Function to add environment variable to all environments
add_env_var() {
    local var_name=$1
    local var_value=$2
    
    echo "Adding $var_name to all environments..."
    
    # Add to production
    echo "$var_value" | vercel env add "$var_name" production
    
    # Add to preview
    echo "$var_value" | vercel env add "$var_name" preview
    
    # Add to development
    echo "$var_value" | vercel env add "$var_name" development
}

# Get Supabase URL
echo "Enter your Supabase URL (e.g., https://your-project.supabase.co):"
read -r supabase_url

if [ -z "$supabase_url" ]; then
    echo "❌ Supabase URL is required!"
    exit 1
fi

# Get Supabase Service Key
echo "Enter your Supabase Service Role Key:"
read -r -s supabase_key

if [ -z "$supabase_key" ]; then
    echo "❌ Supabase Service Key is required!"
    exit 1
fi

# Add environment variables
echo ""
echo "🔧 Adding environment variables to Vercel..."

# Add SUPABASE_URL
add_env_var "SUPABASE_URL" "$supabase_url"

# Add SUPABASE_SERVICE_KEY
add_env_var "SUPABASE_SERVICE_KEY" "$supabase_key"

echo ""
echo "✅ Environment variables added successfully!"
echo ""
echo "🔄 Now pulling updated environment variables..."
vercel env pull .env.local

echo ""
echo "🎉 Setup complete! Your Supabase integration should now work in production."
echo ""
echo "📝 Next steps:"
echo "   1. Test locally with: vercel dev"
echo "   2. Deploy to production: vercel --prod"
echo "   3. Test the API endpoints"
