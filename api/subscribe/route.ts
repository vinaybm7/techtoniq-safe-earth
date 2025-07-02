import { MongoClient, MongoClientOptions, MongoServerError } from 'mongodb';

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MongoDB URI is not defined in environment variables');
  throw new Error('Database configuration error');
}

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient>;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

const options: MongoClientOptions = {
  maxPoolSize: 10, // Maintain up to 10 socket connections
  serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
  socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
};

if (process.env.NODE_ENV === 'development') {
  // In development mode, use a global variable so that the value
  // is preserved across module reloads caused by HMR (Hot Module Replacement).
  if (!global._mongoClientPromise) {
    client = new MongoClient(MONGODB_URI, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  // In production mode, it's best to not use a global variable.
  client = new MongoClient(MONGODB_URI, options);
  clientPromise = client.connect();
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
    return res.status(405).json({ 
      success: false,
      message: 'Method not allowed' 
    });
  }

  if (!req.body || !req.body.email) {
    return res.status(400).json({
      success: false,
      message: 'Email is required'
    });
  }

  const { email } = req.body;
  
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ 
      success: false,
      message: 'Invalid email format' 
    });
  }

  try {
    const client = await clientPromise;
    const db = client.db('techtoniq');
    const collection = db.collection('subscriptions');

    // Check if email exists
    const existing = await collection.findOne({ email });
    if (existing) {
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

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful',
      token: Buffer.from(email).toString('base64')
    });
  } catch (error) {
    console.error('Subscription error:', error);
    
    let errorMessage = 'Failed to process subscription';
    let statusCode = 500;

    if (error instanceof MongoServerError) {
      if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        errorMessage = 'Database connection error';
      } else if (error.code === 11000) {
        // Duplicate key error (email already exists)
        return res.status(200).json({ 
          success: true, 
          message: 'Email already subscribed',
          token: Buffer.from(email).toString('base64')
        });
      }
      console.error('MongoDB Error:', error.message);
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    return res.status(statusCode).json({ 
      success: false, 
      message: errorMessage,
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
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
