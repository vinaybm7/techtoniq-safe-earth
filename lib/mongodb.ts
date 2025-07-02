import { MongoClient, MongoClientOptions, MongoServerSelectionError } from 'mongodb';
import { setTimeout } from 'timers/promises';

// Type for MongoDB connection state
type MongoConnection = {
  client: MongoClient;
  promise: Promise<MongoClient>;
};

// Global variables are used to maintain the connection across function invocations
declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  var _mongoClient: MongoClient | undefined;
  var _mongoConnectionAttempts: number;
}

// Environment variable validation
const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}

const DB_NAME = process.env.MONGODB_DB_NAME || 'techtoniq';
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second
const MAX_RETRY_DELAY = 5000; // 5 seconds
const CONNECTION_TIMEOUT = 10000; // 10 seconds

// MongoDB client options
const options: MongoClientOptions = {
  maxPoolSize: 50, // Adjust based on your needs
  minPoolSize: 1,
  maxIdleTimeMS: 10000,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
  connectTimeoutMS: 10000,
  retryWrites: true,
  retryReads: true,
  w: 'majority',
  appName: 'techtoniq-safe-earth',
  // Enable server discovery and monitoring engine
  monitorCommands: process.env.NODE_ENV === 'development',
  // TLS/SSL options (recommended for production)
  tls: true,
  tlsAllowInvalidCertificates: false,
  // Authentication options
  authMechanism: 'DEFAULT',
};

/**
 * Creates a new MongoDB client with the given options
 */
function createMongoClient(): MongoClient {
  return new MongoClient(MONGODB_URI, options);
}

/**
 * Attempts to connect to MongoDB with retry logic
 */
async function connectWithRetry(client: MongoClient, attempt = 1): Promise<MongoClient> {
  try {
    console.log(`Attempting to connect to MongoDB (attempt ${attempt}/${MAX_RETRIES})`);
    await client.connect();
    console.log('Successfully connected to MongoDB');
    return client;
  } catch (error) {
    await client.close();
    
    if (attempt >= MAX_RETRIES) {
      console.error('Max retries reached. Failed to connect to MongoDB:', error);
      throw new Error(`Failed to connect to MongoDB after ${MAX_RETRIES} attempts: ${error.message}`);
    }

    // Exponential backoff with jitter
    const delay = Math.min(INITIAL_RETRY_DELAY * Math.pow(2, attempt - 1), MAX_RETRY_DELAY);
    const jitter = Math.floor(Math.random() * 1000);
    const waitTime = delay + jitter;
    
    console.warn(`Connection attempt ${attempt} failed. Retrying in ${waitTime}ms...`);
    await setTimeout(waitTime);
    
    return connectWithRetry(createMongoClient(), attempt + 1);
  }
}

/**
 * Gets a cached MongoDB client or creates a new one if needed
 */
async function getMongoClient(): Promise<MongoClient> {
  // In development, use a global variable to preserve the connection across hot reloads
  if (process.env.NODE_ENV === 'development') {
    if (!global._mongoClientPromise) {
      const client = createMongoClient();
      global._mongoClientPromise = connectWithRetry(client);
      global._mongoClient = await global._mongoClientPromise;
    }
    return global._mongoClientPromise;
  }

  // In production, create a new client for each serverless function invocation
  // but reuse the connection if it's still valid
  if (!global._mongoClient || !global._mongoClient.topology?.isConnected()) {
    const client = createMongoClient();
    global._mongoClientPromise = connectWithRetry(client);
    global._mongoClient = await global._mongoClientPromise;
  }

  return global._mongoClientPromise;
}

/**
 * Gets a database instance with the configured database name
 */
export async function getDatabase() {
  const client = await getMongoClient();
  return client.db(DB_NAME);
}

/**
 * Closes the MongoDB connection
 */
export async function closeConnection(): Promise<void> {
  if (global._mongoClient) {
    try {
      await global._mongoClient.close();
      console.log('MongoDB connection closed');
    } catch (error) {
      console.error('Error closing MongoDB connection:', error);
    } finally {
      global._mongoClient = undefined;
      global._mongoClientPromise = undefined;
    }
  }
}

// Handle process termination
process.on('SIGINT', async () => {
  await closeConnection();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await closeConnection();
  process.exit(0);
});

// Export the client promise for backward compatibility
const clientPromise = getMongoClient();
export default clientPromise;
