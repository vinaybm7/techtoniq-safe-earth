import express, { Request, Response, NextFunction, Application } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, Collection, WithId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vnyone7:aXAFVRa2EMNCwu9N@cluster0.idp0jqw.mongodb.net/techtoniq?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI);

// Subscription interface
interface SubscriptionData {
  email: string;
  createdAt: Date;
  isActive: boolean;
  lastUpdated: Date;
}

// Error handling middleware
const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
};

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Subscribe endpoint
app.post('/subscribe', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ success: false, message: 'Invalid email address' });
    }

    const db = client.db('techtoniq');
    const collection = db.collection<SubscriptionData>('subscriptions');

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
      token: Buffer.from(email).toString('base64')
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    next(error);
  }
});

// Apply error handling middleware
app.use(errorHandler);

// Start server
async function startServer() {
  try {
    await connectToMongo();
    
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  try {
    await client.close();
    console.log('MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
});

// Start the server
startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});
