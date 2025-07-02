import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabase } from '@/lib/mongodb';

interface HealthCheckResponse {
  status: 'ok' | 'error';
  timestamp: string;
  uptime: number;
  database: {
    status: 'connected' | 'disconnected' | 'error';
    responseTime?: number;
    error?: string;
  };
  memoryUsage: NodeJS.MemoryUsage;
  environment: string;
  version?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<HealthCheckResponse | { error: string }>
) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', ['GET']);
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const startTime = Date.now();
  const healthCheck: HealthCheckResponse = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    database: { status: 'disconnected' },
    memoryUsage: process.memoryUsage(),
    environment: process.env.NODE_ENV || 'development',
  };

  try {
    // Check database connection
    const dbStartTime = Date.now();
    try {
      const db = await getDatabase();
      await db.command({ ping: 1 });
      const dbEndTime = Date.now();
      
      healthCheck.database = {
        status: 'connected',
        responseTime: dbEndTime - dbStartTime,
      };
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      healthCheck.status = 'error';
      healthCheck.database = {
        status: 'error',
        error: dbError.message,
      };
    }

    // Add version information if available
    if (process.env.npm_package_version) {
      healthCheck.version = process.env.npm_package_version;
    }

    // Determine overall status based on checks
    const statusCode = healthCheck.status === 'ok' ? 200 : 503;
    
    // Add response time
    healthCheck.memoryUsage = process.memoryUsage();
    
    return res.status(statusCode).json(healthCheck);
    
  } catch (error) {
    console.error('Health check failed:', error);
    return res.status(500).json({
      status: 'error',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      database: {
        status: 'error',
        error: error.message,
      },
      memoryUsage: process.memoryUsage(),
      environment: process.env.NODE_ENV || 'development',
    });
  }
}
