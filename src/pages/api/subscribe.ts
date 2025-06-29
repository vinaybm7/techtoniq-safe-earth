import { NextApiRequest, NextApiResponse } from 'next';
import clientPromise from '@/lib/mongodb';

interface SubscriptionData {
  email: string;
  createdAt: Date;
  isActive: boolean;
  lastUpdated: Date;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }

  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }

  try {
    const client = await clientPromise;
    const db = client.db('techtoniq');
    const collection = db.collection<SubscriptionData>('subscriptions');

    // Check if email already exists
    const existingSubscription = await collection.findOne({ email });
    
    if (existingSubscription) {
      return res.status(200).json({ 
        success: true, 
        message: 'Email already subscribed',
        token: Buffer.from(email).toString('base64') // Simple token generation
      });
    }

    // Create new subscription
    const subscription: SubscriptionData = {
      email,
      createdAt: new Date(),
      isActive: false, // Set to true after payment verification
      lastUpdated: new Date()
    };

    await collection.insertOne(subscription);

    res.status(200).json({ 
      success: true, 
      message: 'Subscription successful',
      token: Buffer.from(email).toString('base64') // Simple token generation
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
}
