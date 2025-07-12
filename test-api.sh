#!/bin/bash

echo "🧪 Testing Techtoniq Subscription API"
echo "====================================="

# Test health check
echo "1. Testing health check..."
curl -s http://localhost:3001/api/subscribe | jq '.'

echo -e "\n2. Testing subscription with new email..."
curl -s -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test-'$(date +%s)'@example.com"}' | jq '.'

echo -e "\n3. Testing subscription with existing email..."
curl -s -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}' | jq '.'

echo -e "\n4. Testing invalid email..."
curl -s -X POST http://localhost:3001/api/subscribe \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}' | jq '.'

echo -e "\n✅ API testing completed!"
