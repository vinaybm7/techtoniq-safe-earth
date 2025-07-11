const { createClient } = require('@supabase/supabase-js');

// Enhanced Supabase client with proper error handling
function createSupabaseClient() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
  
  // Validate environment variables
  if (!supabaseUrl) {
    throw new Error('supabaseUrl is required.');
  }
  
  if (!supabaseKey) {
    throw new Error('supabaseKey is required.');
  }
  
  console.log('✅ Supabase client initialized successfully');
  console.log('🔗 URL:', supabaseUrl);
  console.log('🔑 Key:', supabaseKey.substring(0, 10) + '...');
  
  return createClient(supabaseUrl, supabaseKey);
}

let supabase;
try {
  supabase = createSupabaseClient();
} catch (error) {
  console.error('❌ Supabase client initialization failed:', error.message);
  console.error('🔧 Please check your environment variables:');
  console.error('   - SUPABASE_URL');
  console.error('   - SUPABASE_SERVICE_KEY');
  throw error;
}

module.exports = supabase;
