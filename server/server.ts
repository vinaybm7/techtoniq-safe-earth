import express, { Request, Response, NextFunction, Application, RequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, Collection, MongoClientOptions } from 'mongodb';
import dotenv from 'dotenv';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://vnyone7:aXAFVRa2EMNCwu9N@cluster0.idp0jqw.mongodb.net/techtoniq?retryWrites=true&w=majority';
const client = new MongoClient(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
} as MongoClientOptions);

let isMongoConnected = false;

// Subscription interface
interface SubscriptionData {
  email: string;
  createdAt: Date;
  isActive: boolean;
  lastUpdated: Date;
}

// Connect to MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    isMongoConnected = true;
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ Error connecting to MongoDB:', error);
    process.exit(1);
  }
}

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    mongo: isMongoConnected ? 'connected' : 'disconnected'
  });
});

// Subscribe handler
async function handleSubscribe(req: Request, res: Response, next: NextFunction): Promise<void> {
  if (!isMongoConnected) {
    res.status(503).json({ success: false, message: 'Service unavailable' });
    return;
  }

  try {
    const { email } = req.body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      res.status(400).json({ success: false, message: 'Invalid email address' });
      return;
    }

    const db = client.db('techtoniq');
    const collection = db.collection<SubscriptionData>('subscriptions');

    // Check if email already exists
    const existingSubscription = await collection.findOne({ email });
    
    if (existingSubscription) {
      res.status(200).json({ 
        success: true, 
        message: 'Email already subscribed',
        token: Buffer.from(email).toString('base64')
      });
      return;
    }

    // Create new subscription
    const subscription: SubscriptionData = {
      email,
      createdAt: new Date(),
      isActive: false,
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
}

// Routes
app.post('/subscribe', (req, res, next) => {
  handleSubscribe(req, res, next).catch(next);
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

// Start server
async function startServer() {
  try {
    await connectToMongo();
    
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`🔍 Health check: http://localhost:${PORT}/health`);
      console.log(`📝 Subscribe endpoint: POST http://localhost:${PORT}/subscribe`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
const gracefulShutdown = async () => {
  try {
    console.log('\n🛑 Shutting down server...');
    await client.close();
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during shutdown:', error);
    process.exit(1);
  }
};

// Handle process termination
process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

// Start the server
startServer().catch(error => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
