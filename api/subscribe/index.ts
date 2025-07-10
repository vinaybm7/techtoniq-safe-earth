import { VercelRequest, VercelResponse } from '@vercel/node';
import { MongoClient, Db } from 'mongodb';

let cachedDb: Db | null = null;

async function connectToDatabase(uri: string) {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(uri);
  const db = client.db('techtoniq');
  cachedDb = db;
  return db;
}

export default async (req: VercelRequest, res: VercelResponse) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  // Handle GET request for health check
  if (req.method === 'GET') {
    return res.status(200).json({ status: 'ok' });
  }
  
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  // Validate email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    // Connect to MongoDB
    const db = await connectToDatabase(process.env.MONGODB_URI!);
    const collection = db.collection('subscriptions');

    // Check if email already exists
    const existingSubscription = await collection.findOne({ email });
    
    if (existingSubscription) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email already subscribed',
        token: Buffer.from(email).toString('base64')
      });
    }

    // Create new subscription
    const subscription = {
      email,
      createdAt: new Date(),
      isActive: true,
      lastUpdated: new Date()
    };

    await collection.insertOne(subscription);

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful',
      token: Buffer.from(email).toString('base64')
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
};