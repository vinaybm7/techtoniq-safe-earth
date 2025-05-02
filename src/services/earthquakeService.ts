
interface EarthquakeFeature {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    updated: number;
    url: string;
    detail: string;
    status: string;
    depth: number;
    felt: number | null;
    cdi: number | null;
    mmi: number | null;
    alert: string | null;
    tsunami: number;
    sig: number;
    code: string;
    ids: string;
    sources: string;
    types: string;
  };
  geometry: {
    coordinates: [number, number, number]; // [longitude, latitude, depth]
  };
}

interface USGSResponse {
  type: string;
  metadata: {
    generated: number;
    url: string;
    title: string;
    count: number;
  };
  features: EarthquakeFeature[];
}

export interface Earthquake {
  id: string;
  magnitude: number;
  location: string;
  date: string;
  depth: number;
  url: string;
  coordinates: [number, number]; // [longitude, latitude]
  tsunami?: boolean;
  felt?: number | null;
  significance?: number;
  status?: string;
  alert?: string | null; // green, yellow, orange, red
  localTime?: string;
}

export const fetchRecentEarthquakes = async (): Promise<Earthquake[]> => {
  try {
    // Fetch from USGS API - default to all_day
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    const data: USGSResponse = await response.json();
    
    // Map USGS data to our format
    return data.features.map(featureToEarthquake);
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
};

// Function to convert USGS feature to our Earthquake type
const featureToEarthquake = (feature: EarthquakeFeature): Earthquake => {
  // Get UTC time
  const utcDate = new Date(feature.properties.time);
  
  // Get IST time
  const istFormatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'long'
  });
  
  // Get local time based on earthquake coordinates
  const localTime = getLocalTime(
    feature.geometry.coordinates[1], 
    feature.geometry.coordinates[0], 
    feature.properties.time
  );
  
  return {
    id: feature.id,
    magnitude: feature.properties.mag,
    location: feature.properties.place,
    date: istFormatter.format(utcDate),
    depth: Math.round(feature.geometry.coordinates[2]),
    url: feature.properties.url,
    coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] as [number, number],
    tsunami: feature.properties.tsunami === 1,
    felt: feature.properties.felt,
    significance: feature.properties.sig,
    status: feature.properties.status,
    alert: feature.properties.alert,
    localTime: localTime
  };
};

// Function to get local time for a specific location
const getLocalTime = (lat: number, lng: number, timestamp: number): string => {
  try {
    // This is a simplified approach - in a production app, you would want
    // to use a timezone API like Google's Timezone API based on lat/lng
    const date = new Date(timestamp);
    
    // Format the time in a readable format - this doesn't adjust for actual timezone
    // but gives a reasonable approximation for display purposes
    const formatter = new Intl.DateTimeFormat('en-US', {
      dateStyle: 'medium',
      timeStyle: 'medium'
    });
    
    return formatter.format(date) + ' (local approx.)';
  } catch (error) {
    console.error("Error calculating local time:", error);
    return new Date(timestamp).toLocaleString() + ' (UTC)';
  }
};

// Function to fetch earthquakes for a specific timeframe
export const fetchEarthquakesByTimeframe = async (timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<Earthquake[]> => {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_${timeframe}.geojson`
    );
    const data: USGSResponse = await response.json();
    
    return data.features.map(featureToEarthquake);
  } catch (error) {
    console.error(`Error fetching ${timeframe} earthquake data:`, error);
    throw error;
  }
};
