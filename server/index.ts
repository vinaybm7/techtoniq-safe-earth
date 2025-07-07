import express, { Request, Response, NextFunction, Application, RequestHandler } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { MongoClient, Collection, WithId } from 'mongodb';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app: Application = express();
const PORT = process.env.PORT || 3000;

// CORS Configuration
const allowedOrigins = [
  'http://localhost:8080',
  'http://localhost:3000',
  'https://techtoniq-safe-earth.vercel.app',
  'https://techtoniq-safe-earth.netlify.app'
];

// Middleware
app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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

// Fault lines endpoint
app.get('/api/fault-lines', async (req: Request, res: Response) => {
  try {
    const { lat, lng, radius = '200' } = req.query;
    
    if (!lat || !lng) {
      return res.status(400).json({ message: 'Missing required parameters: lat and lng' });
    }

    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
      return res.status(400).json({ message: 'Invalid parameter values' });
    }

    // Import the server-side function
    const { fetchFaultLinesFromUSGS } = await import('../src/server/geologicalData');
    
    // First try with the requested radius
    let faultLines = await fetchFaultLinesFromUSGS(latitude, longitude, radiusKm);
    
    // If no faults found, try with a larger radius
    if (faultLines.length === 0 && radiusKm < 500) {
      faultLines = await fetchFaultLinesFromUSGS(latitude, longitude, 500);
    }

    return res.status(200).json(faultLines);
  } catch (error) {
    console.error('Error in fault-lines API:', error);
    return res.status(500).json({ 
      message: 'Failed to fetch fault lines',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// API Routes
const router = express.Router();

// Subscription endpoint
router.post('/subscribe', (async (req: Request, res: Response) => {
  try {
    const { email } = req.body as { email: string };

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid email address' 
      });
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

    return res.status(200).json({ 
      success: true, 
      message: 'Subscription successful',
      token: Buffer.from(email).toString('base64')
    });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error' 
    });
  }
}) as RequestHandler);

// Mount the router
app.use('/api', router);

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
