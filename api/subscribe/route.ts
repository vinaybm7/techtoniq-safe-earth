import { MongoClient } from 'mongodb';

// Use dynamic import for environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vnyone7:aXAFVRa2EMNCwu9N@cluster0.idp0jqw.mongodb.net/techtoniq?retryWrites=true&w=majority';

// Add error handling for MongoDB connection
let client: MongoClient;

async function getMongoClient() {
  if (!client) {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
  }
  return client;
}

interface SubscriptionData {
  email: string;
  createdAt: Date;
  isActive: boolean;
  lastUpdated: Date;
}

// Using named export for better compatibility
export default async function handler(req: any, res: any) {
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

    const client = await getMongoClient();
    const db = client.db('techtoniq');
    const collection = db.collection<SubscriptionData>('subscriptions');

    // Check if email exists
    const existing = await collection.findOne({ email });
    if (existing) {
      // Don't close the connection in serverless environment
    // Connection will be reused for subsequent requests
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

    // Don't close the connection in serverless environment
    // Connection will be reused for subsequent requests

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

// Add TypeScript types for Vercel Serverless Functions
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGODB_URI: string;
      NODE_ENV: 'development' | 'production';
    }
  }
}

// Vercel Serverless Function config
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    // Enable external resolver for better error handling
    externalResolver: true,
  },
};
