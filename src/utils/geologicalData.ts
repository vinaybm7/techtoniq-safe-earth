interface FaultLine {
  name: string;
  distance: number;
  direction: string;
  type: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

interface USGSFaultFeature {
  type: string;
  properties: {
    name: string;
    slip_type: string;
    slip_direc: string;
    sense: string;
    dip_dir: string;
    dip: number;
  };
  geometry: {
    type: string;
    coordinates: number[][];
  };
}

// Calculate distance between two points in kilometers using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

// Calculate bearing between two points in degrees
const calculateBearing = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const y = Math.sin(lon2 - lon1) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - 
            Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1);
  let bearing = Math.atan2(y, x) * (180 / Math.PI);
  return (bearing + 360) % 360;
};

// Convert bearing to cardinal direction
const getCardinalDirection = (bearing: number): string => {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 
                     'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((bearing %= 360) < 0 ? bearing + 360 : bearing / 22.5) % 16;
  return directions[index];
};

export const getNearbyFaultLines = async (
  lat: number, 
  lng: number, 
  radiusKm: number = 100
): Promise<FaultLine[]> => {
  try {
    // USGS API endpoint for fault data (using the USGS fault database)
    // Note: This is a simplified example. You might need to adjust the URL based on specific USGS API requirements
    const response = await fetch(
      `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=1900-01-01&latitude=${lat}&longitude=${lng}&maxradiuskm=${radiusKm}&producttype=fault`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch fault data');
    }

    const data = await response.json();
    
    // Process the USGS data into our format
    const faultLines: FaultLine[] = [];
    
    if (data.features && Array.isArray(data.features)) {
      data.features.forEach((feature: USGSFaultFeature) => {
        // Get coordinates (USGS typically provides LineString or MultiLineString)
        const coords = feature.geometry.coordinates[0]; // Taking first point for simplicity
        const [lngFault, latFault] = coords;
        
        const distance = calculateDistance(lat, lng, latFault, lngFault);
        const bearing = calculateBearing(lat, lng, latFault, lngFault);
        const direction = getCardinalDirection(bearing);
        
        faultLines.push({
          name: feature.properties.name || 'Unnamed Fault',
          distance: parseFloat(distance.toFixed(1)),
          direction,
          type: feature.properties.slip_type || 'Unknown',
          coordinates: {
            lat: latFault,
            lng: lngFault
          }
        });
      });
    }

    // Sort by distance and limit to top 5 closest faults
    return faultLines
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5);
      
  } catch (error) {
    console.error('Error fetching fault data:', error);
    // Return an empty array or handle the error as needed
    return [];
  }
};
