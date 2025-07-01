import { MongoClient } from 'mongodb';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vnyone7:aXAFVRa2EMNCwu9N@cluster0.idp0jqw.mongodb.net/techtoniq?retryWrites=true&w=majority';

// Connection pooling for serverless
const client = new MongoClient(MONGODB_URI);
let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === 'development') {
  // In development, use a global variable to preserve the connection
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production, use a module-level connection
  clientPromise = client.connect();
}

declare global {
  var _mongoClientPromise: Promise<MongoClient>;
}

interface SubscriptionData {
  email: string;
  createdAt: Date;
  isActive: boolean;
  lastUpdated: Date;
}

// Using named export for better compatibility
export default async function handler(req: any, res: any) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Connect to MongoDB
  const client = await clientPromise;
  const db = client.db('techtoniq');
  const collection = db.collection('subscriptions');
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { email } = req.body;
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address' 
      });
    }

    // Check if email exists
    const existing = await collection.findOne({ email });
    if (existing) {
      // Connection is managed by the clientPromise
      return res.status(200).json({ 
        success: true, 
        message: 'Email already subscribed',
        token: Buffer.from(email).toString('base64')
      });
    }

    // Create new subscription
    await collection.insertOne({
      email,
      createdAt: new Date(),
      isActive: false,
      lastUpdated: new Date()
    });

    // Connection is managed by the clientPromise

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful',
      token: Buffer.from(email).toString('base64')
    });
  } catch (error: any) {
    console.error('Error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}

// Vercel Serverless Function config
export const config = {
  api: {
    // Disable body parsing, we'll handle it manually
    bodyParser: false,
  },
};
