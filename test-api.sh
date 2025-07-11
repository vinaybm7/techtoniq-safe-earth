#!/bin/bash

# Test script for Supabase email subscription API
# Usage: ./test-api.sh [BASE_URL]
# Default: http://localhost:3000

BASE_URL=${1:-"http://localhost:3000"}
API_URL="$BASE_URL/api/subscribe"

echo "🧪 Testing Supabase Email Subscription API"
echo "========================================="
echo "API URL: $API_URL"
echo ""

# Test 1: Health Check (GET)
echo "🔍 Test 1: Health Check (GET)"
echo "curl $API_URL"
curl -s "$API_URL" | jq . 2>/dev/null || curl -s "$API_URL"
echo ""
echo ""

# Test 2: Subscribe New Email (POST)
echo "📧 Test 2: Subscribe New Email (POST)"
TEST_EMAIL="test-$(date +%s)@example.com"
echo "curl -X POST $API_URL -H 'Content-Type: application/json' -d '{\"email\":\"$TEST_EMAIL\"}'"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}" | jq . 2>/dev/null || curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}"
echo ""
echo ""

# Test 3: Duplicate Email (POST)
echo "🔄 Test 3: Duplicate Email (POST)"
echo "curl -X POST $API_URL -H 'Content-Type: application/json' -d '{\"email\":\"$TEST_EMAIL\"}'"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}" | jq . 2>/dev/null || curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"$TEST_EMAIL\"}"
echo ""
echo ""

# Test 4: Invalid Email (POST)
echo "❌ Test 4: Invalid Email (POST)"
echo "curl -X POST $API_URL -H 'Content-Type: application/json' -d '{\"email\":\"invalid-email\"}'"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}' | jq . 2>/dev/null || curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":"invalid-email"}'
echo ""
echo ""

# Test 5: Empty Email (POST)
echo "🚫 Test 5: Empty Email (POST)"
echo "curl -X POST $API_URL -H 'Content-Type: application/json' -d '{\"email\":\"\"}'"
curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":""}' | jq . 2>/dev/null || curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d '{"email":""}'
echo ""
echo ""

# Test 6: Method Not Allowed (PUT)
echo "🚫 Test 6: Method Not Allowed (PUT)"
echo "curl -X PUT $API_URL"
curl -s -X PUT "$API_URL" | jq . 2>/dev/null || curl -s -X PUT "$API_URL"
echo ""
echo ""

echo "✅ All tests completed!"
echo ""
echo "📊 Expected Results:"
echo "   Test 1: Should show 'storage: supabase'"
echo "   Test 2: Should return success with new email"
echo "   Test 3: Should return 'already subscribed'"
echo "   Test 4: Should return 'Invalid email format'"
echo "   Test 5: Should return 'Email is required'"
echo "   Test 6: Should return 'Method not allowed'"
