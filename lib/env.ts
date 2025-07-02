/**
 * Environment variable validation and type safety
 */

function getEnvVar(name: string, required = true): string {
  const value = process.env[name];
  if (required && !value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value || '';
}

// Validate required environment variables
const MONGODB_URI = getEnvVar('MONGODB_URI');

// Optional environment variables with defaults
const NODE_ENV = getEnvVar('NODE_ENV', false) || 'development';
const MONGODB_DB_NAME = getEnvVar('MONGODB_DB_NAME', false) || 'techtoniq';
const VERCEL_ENV = getEnvVar('VERCEL_ENV', false) || NODE_ENV;

// Type-safe environment variables
export const env = {
  // Node environment
  NODE_ENV: NODE_ENV as 'development' | 'production' | 'test',
  
  // Vercel specific
  VERCEL_ENV: VERCEL_ENV as 'development' | 'preview' | 'production',
  VERCEL_URL: getEnvVar('VERCEL_URL', false),
  
  // MongoDB
  MONGODB_URI,
  MONGODB_DB_NAME,
  
  // API
  API_URL: getEnvVar('NEXT_PUBLIC_API_URL', false) || (
    VERCEL_ENV === 'production' 
      ? 'https://your-production-url.com/api' 
      : 'http://localhost:3000/api'
  ),
  
  // Feature flags
  ENABLE_ANALYTICS: getEnvVar('NEXT_PUBLIC_ENABLE_ANALYTICS', false) === 'true',
  
  // Security
  JWT_SECRET: getEnvVar('JWT_SECRET', VERCEL_ENV === 'production'),
  
  // Rate limiting
  RATE_LIMIT_WINDOW_MS: parseInt(getEnvVar('RATE_LIMIT_WINDOW_MS', false) || '900000', 10), // 15 minutes
  RATE_LIMIT_MAX: parseInt(getEnvVar('RATE_LIMIT_MAX', false) || '100', 10), // 100 requests per window
} as const;

// Validate environment in production
if (env.NODE_ENV === 'production') {
  if (!env.MONGODB_URI.includes('mongodb+srv://')) {
    throw new Error('MongoDB connection string must use SRV protocol in production');
  }
  
  if (!env.JWT_SECRET || env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must be at least 32 characters long in production');
  }
}

// Log environment info
console.log(`Environment: ${env.NODE_ENV}`);
console.log(`MongoDB Database: ${env.MONGODB_DB_NAME}`);
if (env.VERCEL_ENV) {
  console.log(`Vercel Environment: ${env.VERCEL_ENV}`);
}
