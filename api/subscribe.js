// Vercel serverless function for subscription API
const { createClient } = require('@supabase/supabase-js');

// Debug: Log environment variable presence
console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_SERVICE_KEY:', process.env.SUPABASE_SERVICE_KEY ? '***set***' : '***missing***');

// Initialize Supabase with provided credentials
const supabaseUrl = process.env.SUPABASE_URL || 'https://wqsuuxgpbgsipnbzzjms.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc3V1eGdwYmdzaXBuYnp6am1zIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjA2MTQwMCwiZXhwIjoyMDY3NjM3NDAwfQ.BQMIAKeuVKqRuHnRps_AzY1xhXxJ22u9iA_TzcQ0KZw';

let supabase = null;
try {
  supabase = createClient(supabaseUrl, supabaseKey);
  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.log('⚠️ Supabase initialization failed:', error.message);
}

// In-memory storage for fallback
let emailSubscriptions = new Set();

// Email validation
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Simple logging
function log(message, data = null) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`, data || '');
}

// Main handler function for Vercel
module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Health check
  if (req.method === 'GET') {
    log('Health check requested');
    
    return res.status(200).json({ 
      status: 'ok', 
      message: 'Techtoniq Subscription API is running perfectly',
      timestamp: new Date().toISOString(),
      version: 'vercel-v1.0',
      storage: supabase ? 'supabase' : 'in-memory',
      environment: process.env.NODE_ENV || 'production',
      supabase_configured: !!supabase,
      totalSubscriptions: supabase ? 'N/A' : emailSubscriptions.size
    });
  }

  // Only POST allowed for subscription
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      message: 'Method not allowed. Use POST to subscribe.' 
    });
  }

  try {
    // Get email from request
    const email = req.body?.email;
    
    log('Subscription attempt for:', email);

    // Validate email exists
    if (!email || typeof email !== 'string' || email.trim() === '') {
      log('Invalid email - missing or empty');
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required and cannot be empty.' 
      });
    }

    // Validate email format
    if (!isValidEmail(email.trim())) {
      log('Invalid email format:', email);
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email format. Please enter a valid email address.' 
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Use Supabase if available, otherwise use in-memory storage
    if (supabase) {
      try {
        // Check if already subscribed
        const { data: existing, error: findErr } = await supabase
          .from('subscriptions')
          .select('id')
          .eq('email', cleanEmail)
          .single();

        if (findErr && findErr.code !== 'PGRST116') {
          log('Error checking existing subscription:', findErr.message);
          // Fall back to in-memory storage if Supabase fails
          return handleInMemorySubscription(cleanEmail, res);
        }

        if (existing) {
          log('Email already subscribed:', cleanEmail);
          return res.status(200).json({ 
            success: true, 
            message: 'Email is already subscribed to earthquake alerts.' 
          });
        }

        // Add subscription
        const { error: insertErr } = await supabase
          .from('subscriptions')
          .insert([{ email: cleanEmail, created_at: new Date().toISOString() }]);

        if (insertErr) {
          log('Error inserting subscription:', insertErr.message);
          // Fall back to in-memory storage if Supabase fails
          return handleInMemorySubscription(cleanEmail, res);
        }

        log('Successful subscription for:', cleanEmail);
        return res.status(200).json({ 
          success: true, 
          message: 'Successfully subscribed to earthquake alerts!',
          data: { 
            email: cleanEmail, 
            subscribed_at: new Date().toISOString(),
            storage: 'supabase'
          }
        });
      } catch (supabaseError) {
        log('Supabase operation failed, falling back to in-memory:', supabaseError.message);
        return handleInMemorySubscription(cleanEmail, res);
      }
    } else {
      // Use in-memory storage
      return handleInMemorySubscription(cleanEmail, res);
    }

  } catch (error) {
    log('Subscription API Error:', error.message);
    log('Error stack:', error.stack);
    
    return res.status(500).json({ 
      success: false, 
      message: 'Subscription failed. Please try again.',
      error_details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Fallback function for in-memory storage
function handleInMemorySubscription(cleanEmail, res) {
  if (emailSubscriptions.has(cleanEmail)) {
    log('Email already subscribed (in-memory):', cleanEmail);
    return res.status(200).json({ 
      success: true, 
      message: 'Email is already subscribed to earthquake alerts.' 
    });
  }

  emailSubscriptions.add(cleanEmail);
  log('Successful subscription (in-memory) for:', cleanEmail);
  
  return res.status(200).json({ 
    success: true, 
    message: 'Successfully subscribed to earthquake alerts!',
    data: { 
      email: cleanEmail, 
      subscribed_at: new Date().toISOString(),
      storage: 'in-memory'
    }
  });
}
