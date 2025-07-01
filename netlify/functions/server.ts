import { Handler } from '@netlify/functions';
import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI || 'your-mongodb-uri';

const handler: Handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { email } = JSON.parse(event.body || '{}');
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Invalid email address' })
      };
    }

    const client = await MongoClient.connect(MONGODB_URI);
    const db = client.db('techtoniq');
    const collection = db.collection('subscriptions');

    // Check if email exists
    const existing = await collection.findOne({ email });
    if (existing) {
      await client.close();
      return {
        statusCode: 200,
        body: JSON.stringify({ 
          success: true, 
          message: 'Email already subscribed',
          token: Buffer.from(email).toString('base64')
        })
      };
    }

    // Create new subscription
    await collection.insertOne({
      email,
      createdAt: new Date(),
      isActive: false,
      lastUpdated: new Date()
    });

    await client.close();

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        success: true, 
        message: 'Subscription successful',
        token: Buffer.from(email).toString('base64')
      })
    };
  } catch (error) {
    console.error('Error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Internal server error' })
    };
  }
};

export { handler };
