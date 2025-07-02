#!/bin/bash
set -e

echo "🔄 Updating package versions..."

# Create a backup of package.json
cp package.json package.json.bak

# Update specific package versions
jq 'del(.dependencies["@vercel/build-utils"])' package.json > temp.json && mv temp.json package.json
jq 'del(.devDependencies["@vercel/node"])' package.json > temp.json && mv temp.json package.json
jq '.dependencies += {"@vercel/build-utils": "^6.8.0"}' package.json > temp.json && mv temp.json package.json
jq '.devDependencies += {"@vercel/node": "^4.0.0"}' package.json > temp.json && mv temp.json package.json

echo "✅ Package versions updated successfully!"
