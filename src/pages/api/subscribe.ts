import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB_NAME || 'techtoniq';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!uri) {
    return res.status(500).json({ success: false, message: 'MONGODB_URI environment variable is not set.' });
  }
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method not allowed' });
  }
  const { email } = req.body;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ success: false, message: 'Invalid email address' });
  }
  let client: MongoClient | null = null;
  try {
    client = await MongoClient.connect(uri, { maxPoolSize: 1 });
    const db = client.db(dbName);
    const collection = db.collection('subscriptions');
    const existing = await collection.findOne({ email });
    if (existing) {
      return res.status(200).json({ success: true, message: 'Email already subscribed', token: Buffer.from(email).toString('base64') });
    }
    await collection.insertOne({ email, createdAt: new Date(), isActive: true, lastUpdated: new Date() });
    return res.status(200).json({ success: true, message: 'Subscription successful', token: Buffer.from(email).toString('base64') });
  } catch (error: any) {
    console.error('Subscription error:', error);
    return res.status(500).json({ success: false, message: error.message || 'Internal server error' });
  } finally {
    if (client) await client.close();
  }
}
