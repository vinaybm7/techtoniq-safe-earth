import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wqsuuxgpbgsipnbzzjms.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indxc3V1eGdwYmdzaXBuYnp6am1zIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIwNjE0MDAsImV4cCI6MjA2NzYzNzQwMH0.MASxCbSIHKvXpmv4377pRof8JhfcJNJ8ZUSE2Gzc1w0';
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { email } = req.body;
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
    if (existing) {
      return res.status(200).json({ success: true, message: 'Email already subscribed' });
    }
    // Insert new subscription
    const { error } = await supabase
      .from('subscriptions')
      .insert([{ email }]);
    if (error) {
      return res.status(500).json({ success: false, message: error.message || 'Failed to subscribe.' });
    }
    return res.status(200).json({ success: true, message: 'Subscription successful' });
  } catch (err: any) {
    return res.status(500).json({ success: false, message: err.message || 'Internal server error' });
  }
}
