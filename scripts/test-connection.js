#!/usr/bin/env node

const { MongoClient } = require('mongodb');
const axios = require('axios');
require('dotenv').config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

async function testMongoDBConnection() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI is not defined in environment variables');
    process.exit(1);
  }

  const client = new MongoClient(MONGODB_URI, {
    connectTimeoutMS: 5000,
    serverSelectionTimeoutMS: 5000,
  });

  try {
    console.log('🔌 Testing MongoDB connection...');
    await client.connect();
    await client.db().command({ ping: 1 });
    console.log('✅ MongoDB connection successful!');

    // Test database operations
    const db = client.db(process.env.MONGODB_DB_NAME || 'techtoniq');
    const collection = db.collection('subscriptions');
    
    // Test write
    const testEmail = `test-${Date.now()}@example.com`;
    await collection.insertOne({
      email: testEmail,
      createdAt: new Date(),
      isActive: true,
    });
    console.log('✅ MongoDB write test successful!');

    // Test read
    const doc = await collection.findOne({ email: testEmail });
    console.log('✅ MongoDB read test successful!');
    
    // Cleanup
    await collection.deleteOne({ email: testEmail });
    console.log('✅ MongoDB cleanup successful!');

    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  } finally {
    await client.close();
  }
}

async function testApiEndpoints() {
  try {
    console.log('\n🌐 Testing API endpoints...');
    
    // Test health check
    const healthResponse = await axios.get(`${API_URL}/health`);
    console.log('✅ Health check:', healthResponse.data);
    
    // Test subscription endpoint
    const testEmail = `test-${Date.now()}@example.com`;
    const subscribeResponse = await axios.post(`${API_URL}/subscribe`, {
      email: testEmail,
    });
    console.log('✅ Subscription test:', subscribeResponse.data);
    
    return true;
  } catch (error) {
    console.error('❌ API test failed:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting connection tests...');
  
  const mongoSuccess = await testMongoDBConnection();
  const apiSuccess = await testApiEndpoints();
  
  console.log('\n📊 Test Results:');
  console.log(`- MongoDB: ${mongoSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`- API: ${apiSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  
  process.exit(mongoSuccess && apiSuccess ? 0 : 1);
}

runTests().catch(console.error);
