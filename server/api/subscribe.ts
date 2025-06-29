import { MongoClient } from 'mongodb';

// This would be in your environment variables in production
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vnyone7:aXAFVRa2EMNCwu9N@cluster0.idp0jqw.mongodb.net/techtoniq?retryWrites=true&w=majority';

interface SubscriptionData {
  email: string;
  createdAt: Date;
  isActive: boolean;
  lastUpdated: Date;
}

export async function POST({ request }: { request: Request }) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ success: false, message: 'Invalid email address' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('techtoniq');
    const collection = db.collection<SubscriptionData>('subscriptions');

    // Check if email already exists
    const existingSubscription = await collection.findOne({ email });
    
    if (existingSubscription) {
      await client.close();
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Email already subscribed',
          token: Buffer.from(email).toString('base64')
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Create new subscription
    const subscription: SubscriptionData = {
      email,
      createdAt: new Date(),
      isActive: false, // Set to true after payment verification
      lastUpdated: new Date()
    };

    await collection.insertOne(subscription);
    await client.close();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Subscription successful',
        token: Buffer.from(email).toString('base64')
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error saving subscription:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
