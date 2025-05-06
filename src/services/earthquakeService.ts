
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

// Function to check if an earthquake is in or near India based on location name or coordinates
const isInIndia = (feature: EarthquakeFeature): boolean => {
  const locationLower = feature.properties.place.toLowerCase();
  
  // Explicitly exclude "indian springs" and similar locations outside India
  if (locationLower.includes('indian springs')) {
    return false;
  }
  
  // Check if the location text contains India or nearby regions
  if (locationLower.includes('india') || 
      locationLower.includes('gujarat') ||
      locationLower.includes('delhi') ||
      locationLower.includes('mumbai') ||
      locationLower.includes('chennai') ||
      locationLower.includes('kolkata') ||
      locationLower.includes('himachal') ||
      locationLower.includes('ladakh') ||
      locationLower.includes('kashmir') ||
      locationLower.includes('assam') ||
      locationLower.includes('bihar') ||
      locationLower.includes('sikkim')) {
    return true;
  }
  
  // Check coordinates - India is roughly between 8°N-37°N latitude and 68°E-97°E longitude
  const latitude = feature.geometry.coordinates[1];
  const longitude = feature.geometry.coordinates[0];
  
  if ((latitude >= 8 && latitude <= 37) && (longitude >= 68 && longitude <= 97)) {
    return true;
  }
  
  return false;
};

export const fetchRecentEarthquakes = async (): Promise<Earthquake[]> => {
  try {
    // Fetch from USGS API - using all_week to have more data to filter from
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"
    );
    const data: USGSResponse = await response.json();
    
    // Separate Indian earthquakes from others
    const indianEarthquakes: EarthquakeFeature[] = [];
    const otherEarthquakes: EarthquakeFeature[] = [];
    
    data.features.forEach(feature => {
      if (isInIndia(feature)) {
        indianEarthquakes.push(feature);
      } else {
        otherEarthquakes.push(feature);
      }
    });
    
    console.log(`Found ${indianEarthquakes.length} Indian earthquakes and ${otherEarthquakes.length} other earthquakes`);
    
    // Sort by time (newest first) before combining
    indianEarthquakes.sort((a, b) => b.properties.time - a.properties.time);
    otherEarthquakes.sort((a, b) => b.properties.time - a.properties.time);
    
    // Take the first 20 of each to work with
    const topIndianEarthquakes = indianEarthquakes.slice(0, 20);
    const topOtherEarthquakes = otherEarthquakes.slice(0, 100);
    
    // Create prioritized list: ensure ~60% Indian if possible
    const prioritizedFeatures: EarthquakeFeature[] = [];
    let indianIndex = 0;
    let otherIndex = 0;
    
    // Try to add 2-3 Indian earthquakes for every 2 other earthquakes
    while (prioritizedFeatures.length < 50 && 
           (indianIndex < topIndianEarthquakes.length || otherIndex < topOtherEarthquakes.length)) {
      
      // Add 2-3 Indian earthquakes if available
      const indianToAdd = Math.min(3, topIndianEarthquakes.length - indianIndex);
      for (let i = 0; i < indianToAdd; i++) {
        if (indianIndex < topIndianEarthquakes.length) {
          prioritizedFeatures.push(topIndianEarthquakes[indianIndex++]);
        }
      }
      
      // Add 2 other earthquakes if available
      const otherToAdd = Math.min(2, topOtherEarthquakes.length - otherIndex);
      for (let i = 0; i < otherToAdd; i++) {
        if (otherIndex < topOtherEarthquakes.length) {
          prioritizedFeatures.push(topOtherEarthquakes[otherIndex++]);
        }
      }
    }
    
    // If we couldn't find enough Indian earthquakes, fill with others
    if (prioritizedFeatures.length < 20) {
      while (prioritizedFeatures.length < 20 && otherIndex < topOtherEarthquakes.length) {
        prioritizedFeatures.push(topOtherEarthquakes[otherIndex++]);
      }
    }
    
    // Re-sort by time (newest first) now that we've combined them
    prioritizedFeatures.sort((a, b) => b.properties.time - a.properties.time);
    
    // Map to our format
    return prioritizedFeatures.map(featureToEarthquake);
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
    
    // Apply the same India-prioritizing logic as in fetchRecentEarthquakes
    const indianEarthquakes: EarthquakeFeature[] = [];
    const otherEarthquakes: EarthquakeFeature[] = [];
    
    data.features.forEach(feature => {
      if (isInIndia(feature)) {
        indianEarthquakes.push(feature);
      } else {
        otherEarthquakes.push(feature);
      }
    });
    
    // Sort by time (newest first) before combining
    indianEarthquakes.sort((a, b) => b.properties.time - a.properties.time);
    otherEarthquakes.sort((a, b) => b.properties.time - a.properties.time);
    
    // Take the first 20 of each to work with
    const topIndianEarthquakes = indianEarthquakes.slice(0, 20);
    const topOtherEarthquakes = otherEarthquakes.slice(0, 100);
    
    // Create prioritized list: ensure ~60% Indian if possible
    const prioritizedFeatures: EarthquakeFeature[] = [];
    let indianIndex = 0;
    let otherIndex = 0;
    
    // Try to add 2-3 Indian earthquakes for every 2 other earthquakes
    while (prioritizedFeatures.length < 50 && 
           (indianIndex < topIndianEarthquakes.length || otherIndex < topOtherEarthquakes.length)) {
      
      // Add 2-3 Indian earthquakes if available
      const indianToAdd = Math.min(3, topIndianEarthquakes.length - indianIndex);
      for (let i = 0; i < indianToAdd; i++) {
        if (indianIndex < topIndianEarthquakes.length) {
          prioritizedFeatures.push(topIndianEarthquakes[indianIndex++]);
        }
      }
      
      // Add 2 other earthquakes if available
      const otherToAdd = Math.min(2, topOtherEarthquakes.length - otherIndex);
      for (let i = 0; i < otherToAdd; i++) {
        if (otherIndex < topOtherEarthquakes.length) {
          prioritizedFeatures.push(topOtherEarthquakes[otherIndex++]);
        }
      }
    }
    
    // If we couldn't find enough Indian earthquakes, fill with others
    if (prioritizedFeatures.length < 20) {
      while (prioritizedFeatures.length < 20 && otherIndex < topOtherEarthquakes.length) {
        prioritizedFeatures.push(topOtherEarthquakes[otherIndex++]);
      }
    }
    
    // Re-sort by time (newest first) now that we've combined them
    prioritizedFeatures.sort((a, b) => b.properties.time - a.properties.time);
    
    // Map to our format
    return prioritizedFeatures.map(featureToEarthquake);
  } catch (error) {
    console.error(`Error fetching ${timeframe} earthquake data:`, error);
    throw error;
  }
};
