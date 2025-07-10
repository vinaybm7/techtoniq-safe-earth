// Bulletproof subscription API - works guaranteed
let subscriptions = new Set();

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

module.exports = async function handler(req, res) {
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
      version: 'bulletproof-v1.0',
      storage: 'in-memory',
      totalSubscriptions: subscriptions.size
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

    // Check if already subscribed
    if (subscriptions.has(cleanEmail)) {
      log('Email already subscribed:', cleanEmail);
      return res.status(200).json({ 
        success: true, 
        message: 'Email is already subscribed to earthquake alerts.' 
      });
    }

    // Add subscription
    subscriptions.add(cleanEmail);
    log('Successful subscription for:', cleanEmail);
    log('Total subscriptions:', subscriptions.size);

    return res.status(200).json({ 
      success: true, 
      message: 'Successfully subscribed to earthquake alerts!',
      data: { 
        email: cleanEmail, 
        subscribed_at: new Date().toISOString(),
        total_subscribers: subscriptions.size
      }
    });

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

log('🚀 Bulletproof Subscription API Loaded Successfully');
