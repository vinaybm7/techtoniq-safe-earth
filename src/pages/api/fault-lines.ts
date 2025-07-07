import { NextApiRequest, NextApiResponse } from 'next';
import { fetchFaultLinesFromUSGS } from '@/server/geologicalData';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { lat, lng, radius = '200' } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ message: 'Missing required parameters: lat and lng' });
  }

  try {
    const latitude = parseFloat(lat as string);
    const longitude = parseFloat(lng as string);
    const radiusKm = parseInt(radius as string, 10);

    if (isNaN(latitude) || isNaN(longitude) || isNaN(radiusKm)) {
      return res.status(400).json({ message: 'Invalid parameter values' });
    }

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
      error: error instanceof Error ? error.message : 'Unknown error',
      details: process.env.NODE_ENV === 'development' ? error : undefined
    });
  }
}
