
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
  if (req.method === 'GET') {
    const { email } = req.query;

    if (!email || typeof email !== 'string' || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ isSubscribed: false, message: 'Invalid email address' });
    }

    try {
      const db = await connectToDatabase(process.env.MONGODB_URI!);
      const collection = db.collection('subscriptions');

      const existingSubscription = await collection.findOne({ email });

      if (existingSubscription) {
        return res.status(200).json({ isSubscribed: true });
      } else {
        return res.status(200).json({ isSubscribed: false });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ isSubscribed: false, message: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
};
