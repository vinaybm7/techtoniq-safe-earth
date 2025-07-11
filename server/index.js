const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Supabase client initialization
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.get('/api/fault-lines', async (req, res) => {
  try {
    const { lat, lng, radius = '200' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Missing required parameters: lat and lng' });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusKm = parseInt(radius, 10);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
      return res.status(400).json({ message: 'Invalid parameter values' });
    }

    // Import the server-side function
    const { fetchFaultLinesFromUSGS } = require('../src/server/geologicalData');
    
    // First try with the requested radius
    let faultLines = await fetchFaultLinesFromUSGS(latitude, longitude, radiusKm);
    
    // If no faults found, try with a larger radius
    if (faultLines.length === 0 && radiusKm < 500) {
      faultLines = await fetchFaultLinesFromUSGS(latitude, longitude, 500);
    }

    return res.status(200).json(faultLines);
  } catch (error) {
    console.error('Error in fault-lines API:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch fault lines',
      error: error.message
    });
  }
});

// Subscription API route
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;
  console.log('📩 New subscription attempt:', email);
  
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
  
  try {
    // Check if already subscribed
    const { data: existing, error: findError } = await supabase
      .from('subscriptions')
      .select('id')
      .eq('email', email)
      .single();
      
    if (findError && findError.code !== 'PGRST116') {
      console.error('❌ Error checking subscription:', findError);
      // Continue with subscription attempt instead of returning error
    }
    
    if (existing) {
      return res.status(200).json({ success: true, message: 'Email already subscribed' });
    }
    
    // Insert new subscription
    const { error } = await supabase
      .from('subscriptions')
      .insert([{ email, created_at: new Date().toISOString() }]);
      
    if (error) {
      console.error('❌ Error creating subscription:', error);
      return res.status(500).json({ success: false, message: error.message || 'Failed to subscribe.' });
    }
    
    return res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (err) {
    console.error('❌ Subscription Error:', err);
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist/client')));
  
  // Handle SPA routing
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/client/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
