import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface Subscription {
  _id?: ObjectId;
  email: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  source?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ 
      success: false, 
      message: `Method ${req.method} not allowed` 
    });
  }

  const { email } = req.body;

  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid email address',
    });
  }

  try {
    const db = await getDatabase();
    const collection = db.collection<Subscription>('subscriptions');
    
    // Check if email already exists
    const existingSubscription = await collection.findOne({ email });
    
    if (existingSubscription) {
      return res.status(200).json({
        success: true,
        message: 'Email already subscribed',
        data: {
          id: existingSubscription._id,
          email: existingSubscription.email,
          isActive: existingSubscription.isActive
        }
      });
    }

    // Create new subscription
    const now = new Date();
    const subscription: Subscription = {
      email,
      isActive: true,
      createdAt: now,
      updatedAt: now,
      source: 'website'
    };

    const result = await collection.insertOne(subscription);

    return res.status(201).json({
      success: true,
      message: 'Subscription successful',
      data: {
        id: result.insertedId,
        email: subscription.email,
        isActive: subscription.isActive
      }
    });

  } catch (error) {
    console.error('Subscription error:', error);
    
    // Handle specific MongoDB errors
    if (error.name === 'MongoServerError' && error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'This email is already subscribed',
      });
    }
    
    return res.status(500).json({
      success: false,
      message: 'Failed to process subscription',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined,
    });
  }
}
