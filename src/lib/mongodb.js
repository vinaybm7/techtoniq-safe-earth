import { MongoClient } from 'mongodb';
if (!process.env.MONGODB_URI) {
    throw new Error('Please add your Mongo URI to .env.local');
}
const uri = process.env.MONGODB_URI;
const options = {};
let client;
let clientPromise;
if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable to preserve the connection across module reloads
    let globalWithMongo = global;
    if (!globalWithMongo._mongoClientPromise) {
        client = new MongoClient(uri, options);
        globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
}
else {
    // In production mode, avoid using a global variable
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
}
// Export a module-scoped MongoClient promise
// This allows the client to be shared across functions
export default clientPromise;
