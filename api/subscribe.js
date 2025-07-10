// Test simple function first
let supabase = null;

// Try to load Supabase only if available
try {
  const { createClient } = require('@supabase/supabase-js');
  const SUPABASE_URL = 'https://wqsuuxgpbgsipnbzzjms.supabase.co';
  const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc3V1eGdwYmdzaXBuYnp6am1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjE0MDAsImV4cCI6MjA2NzYzNzQwMH0.MASxCbSIHKvXpmv4377pRof8JhfcJNJ8ZUSE2Gzc1w0';
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (error) {
  console.log('Supabase not available:', error.message);
}

module.exports = async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Handle GET request for health check
  if (req.method === 'GET') {
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Techtoniq Subscription API is running',
      timestamp: new Date().toISOString(),
      version: 'js-simple',
      supabaseLoaded: !!supabase
    });
  }

  // Only allow POST requests for subscription
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST to subscribe.' 
    });
  }

  try {
    const { email } = req.body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format' 
      });
    }

    console.log('📩 New subscription attempt:', email);

    // If Supabase is not available, return success anyway for testing
    if (!supabase) {
      console.log('⚠️ Supabase not available, simulating success');
      return res.status(200).json({ 
        success: true, 
        message: 'Subscription received (test mode - database not available)',
        data: { email, subscribed_at: new Date().toISOString() }
      });
    }

    // Check if email already exists
    const { data: existing, error: findError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('email', email)
      .single();

    // Handle the error properly - PGRST116 means no rows found (which is expected for new subscriptions)
    if (findError && findError.code !== 'PGRST116') {
      console.error('❌ Error checking existing subscription:', findError);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error while checking subscription' 
      });
    }

    if (existing) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email already subscribed to earthquake alerts' 
      });
    }

    // Insert new subscription
    const { data, error: insertError } = await supabase
      .from('subscriptions')
      .insert([{ 
        email, 
        created_at: new Date().toISOString(),
        subscription_type: 'earthquake_alerts',
        is_active: true
      }])
      .select();

    if (insertError) {
      console.error('❌ Error inserting subscription:', insertError);
      return res.status(500).json({ 
        success: false, 
        message: 'Failed to create subscription. Please try again.' 
      });
    }

    console.log('✅ Subscription successful for:', email);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to earthquake alerts!',
      data: { email, subscribed_at: new Date().toISOString() }
    });

  } catch (error) {
    console.error('❌ Subscription API Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error. Please try again later.' 
    });
  }
};
