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

// Updated function to check if an earthquake is in India based on specific locations
const isInIndia = (feature: EarthquakeFeature): boolean => {
  const locationLower = feature.properties.place.toLowerCase();
  
  // First, explicitly exclude locations that clearly aren't in India but might match partial text
  if (locationLower.includes('indian springs') || 
      locationLower.includes('indian wells') || 
      locationLower.includes('indianapolis') ||
      locationLower.includes('southeast indian ridge') ||
      locationLower.includes('southwest indian ridge') ||
      locationLower.includes('central indian ridge') ||
      locationLower.includes('indian ocean') ||
      locationLower.includes('indian ridge') ||
      (locationLower.includes('indian') && locationLower.includes('california')) ||
      locationLower.includes('indonesia') ||
      locationLower.includes('sumatera') ||
      locationLower.includes('sumatra') ||
      locationLower.includes('simeulue') ||
      locationLower.includes('nias') ||
      locationLower.includes('mentawai') ||
      locationLower.includes('java') ||
      locationLower.includes('kalimantan') ||
      locationLower.includes('minahasa') ||
      locationLower.includes('sulawesi') ||
      locationLower.includes('kalimanta') ||
      locationLower.includes('lombok') ||
      locationLower.includes('bali') ||
      locationLower.includes('flores') ||
      locationLower.includes('sumba') ||
      locationLower.includes('timor') ||
      locationLower.includes('molucca') ||
      locationLower.includes('irian') ||
      locationLower.includes('maluku') ||
      locationLower.includes('papua') ||
      (locationLower.includes('indian') && locationLower.includes('nevada')) ||
      (locationLower.includes('indian') && locationLower.includes('ridge')) ||
      (locationLower.includes('indian') && locationLower.includes('ocean')) ||
      locationLower.includes('china') ||
      locationLower.includes('afghanistan') ||
      locationLower.includes('burma') ||
      locationLower.includes('myanmar') ||
      locationLower.includes('tibet') ||
      locationLower.includes('pakistan') ||
      locationLower.includes('bangladesh') ||
      locationLower.includes('nepal') ||
      locationLower.includes('bhutan'))
  {
    return false;
  }
  
  // Include general Indian identifiers
  if (locationLower.includes('india') || 
      locationLower.includes('delhi') ||
      locationLower.includes('west bengal') ||
      locationLower.includes('rajasthan'))
  {
    return true;
  }

  // Check for specific Indian states and union territories
  const indianStates = [
    'andaman', 'nicobar', 'assam', 'gujarat', 'jammu', 'kashmir', 'maharashtra', 
    'madhya pradesh', 'manipur', 'meghalaya', 'sikkim', 'tripura', 'uttar pradesh', 
    'uttarakhand', 'west bengal', 'arunachal pradesh', 'telangana', 'himachal pradesh', 
    'ladakh'
  ];
  
  if (indianStates.some(state => locationLower.includes(state))) {
    return true;
  }
  
  // Check for specific cities/locations in Andaman and Nicobar Islands
  const andamanLocations = ['bamboo flat', 'diglipur', 'little nicobar', 'rongat', 'ariel bay'];
  if (andamanLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Assam
  const assamLocations = ['guwahati', 'kamrup', 'hailakandi', 'cachar', 'dhekiajuli', 'udalguri', 
                         'goalpara', 'goālpāra', 'marigaon', 'hojai', 'hojāi', 'haflong', 
                         'hāflong', 'silchar'];
  if (assamLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Gujarat
  const gujaratLocations = ['gandhidham', 'bhuj', 'ahmadabad', 'rajkot', 'jaisalmer', 'rupar', 
                           'chanasma', 'chānasma', 'anjar', 'kandla', 'broach', 'bhachau', 
                           'mundra', 'khadir', 'khavda', 'lakhpat', 'rapar', 'kheda', 'amreli', 
                           'jamnagar', 'mendarda', 'dwarka', 'dwārka', 'visavadar', 'vīsāvadar', 
                           'dhari', 'dhāri', 'paddhari', 'sikka', 'chalala', 'chalāla', 'naliya', 
                           'delvada', 'delvāda'];
  if (gujaratLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Jammu and Kashmir
  const jkLocations = ['kupwara', 'kishtwar', 'doda', 'ramban', 'dharmsala'];
  if (jkLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Maharashtra
  const maharashtraLocations = ['palghar', 'satara', 'ambeghar', 'dicholi', 'kisrule', 'dhebewadi', 
                              'kolhapur', 'ratnagiri', 'latur', 'osmanabad', 'killari'];
  if (maharashtraLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Madhya Pradesh
  const mpLocations = ['jabalpur'];
  if (mpLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Manipur
  const manipurLocations = ['impahl', 'imphal', 'wangjing', 'wāngjing', 'churachandpur', 
                          'churāchāndpur', 'yairipok', 'phek', 'moirang', 'moirāng'];
  if (manipurLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Meghalaya
  const meghalayaLocations = ['kokrajhar', 'nongstoin', 'tura'];
  if (meghalayaLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Sikkim
  const sikkimLocations = ['jausari', 'chamoli', 'nandprayag', 'singtam', 'naya bazar', 'naya bāzār'];
  if (sikkimLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Tripura
  const tripuraLocations = ['ambasa', 'agartala'];
  if (tripuraLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Uttar Pradesh
  const upLocations = ['badaun', 'meerut', 'noida', 'rewari'];
  if (upLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Uttarakhand
  const uttarakhandLocations = ['chamoli', 'rudraprayag', 'tehri garhwal', 'uttarkashi', 'muzaffarnagar', 
                              'deurala', 'jaisinghnagar', 'kotma', 'sarai', 'umaria'];
  if (uttarakhandLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Arunachal Pradesh
  const arunachalLocations = ['itanagar', 'itānagar', 'bomdila', 'along', 'ziro'];
  if (arunachalLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Telangana
  const telanganaLocations = ['mulugu'];
  if (telanganaLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Himachal Pradesh
  const hpLocations = ['kangra', 'kinnaur'];
  if (hpLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check for specific cities/locations in Ladakh
  const ladakhLocations = ['padam'];
  if (ladakhLocations.some(location => locationLower.includes(location))) {
    return true;
  }
  
  // Check coordinates - India is roughly between 6°N-37°N latitude and 68°E-97°E longitude
  const latitude = feature.geometry.coordinates[1];
  const longitude = feature.geometry.coordinates[0];
  
  // More precise bounding box for India (excluding parts that overlap with neighboring countries)
  if ((latitude >= 6 && latitude <= 37) && (longitude >= 68 && longitude <= 97)) {
    // Include Andaman and Nicobar Islands (more specific coordinates)
    if ((latitude >= 6 && latitude <= 14) && (longitude >= 92 && longitude <= 94)) return true;
    
    // Additional checks to exclude neighboring countries when using coordinates
    // Exclude Pakistan (west)
    if (longitude < 72 && latitude > 23) return false;
    
    // Exclude China/Tibet (north)
    if (latitude > 32 && longitude > 78 && longitude < 88) return false;
    
    // Exclude Nepal/Bhutan area
    if (latitude > 26.5 && latitude < 29 && longitude > 80 && longitude < 92) return false;
    
    // Exclude Bangladesh (east)
    if (latitude > 21 && latitude < 26 && longitude > 88 && longitude < 92) return false;
    
    // Exclude Myanmar (further east)
    if (latitude > 20 && longitude > 92) return false;
    
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

// Updated function to fetch historical earthquakes in India with expanded search
export const fetchHistoricalIndianEarthquakes = async (): Promise<Earthquake[]> => {
  try {
    // First, fetch the last 10 years of data
    const endDate = new Date();
    const startDate = new Date();
    startDate.setFullYear(endDate.getFullYear() - 10); // 10 years back

    const startTimeStr = startDate.toISOString();
    const endTimeStr = endDate.toISOString();
    
    // Use a bounding box to capture all Indian earthquakes
    const url = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${startTimeStr}&endtime=${endTimeStr}&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=97&minmagnitude=1`;
    
    console.log("Fetching historical Indian earthquakes with URL:", url);
    const response = await fetch(url);
    const data: USGSResponse = await response.json();
    
    // Filter to ensure we only get earthquakes in India
    const recentIndianEarthquakes = data.features.filter(isInIndia);
    
    console.log(`Found ${recentIndianEarthquakes.length} historical Indian earthquakes from last 10 years`);
    
    // Now fetch older significant earthquakes (magnitude > 4.5)
    // Going back 30 years for significant earthquakes
    const oldStartDate = new Date();
    oldStartDate.setFullYear(startDate.getFullYear() - 20); // 30 years total from today
    
    const oldStartTimeStr = oldStartDate.toISOString();
    
    // Fetch only significant earthquakes (magnitude 4.5+) for the older period
    const significantUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${oldStartTimeStr}&endtime=${startTimeStr}&minlatitude=6&maxlatitude=37&minlongitude=68&maxlongitude=97&minmagnitude=4.5`;
    
    console.log("Fetching older significant Indian earthquakes with URL:", significantUrl);
    const significantResponse = await fetch(significantUrl);
    const significantData: USGSResponse = await significantResponse.json();
    
    // Filter significant earthquakes for India
    const olderSignificantEarthquakes = significantData.features.filter(isInIndia);
    
    console.log(`Found ${olderSignificantEarthquakes.length} older significant Indian earthquakes`);
    
    // Combine both datasets
    const combinedEarthquakes = [...recentIndianEarthquakes, ...olderSignificantEarthquakes];
    
    // Sort by time (newest first)
    combinedEarthquakes.sort((a, b) => b.properties.time - a.properties.time);
    
    // Map to our format
    return combinedEarthquakes.map(featureToEarthquake);
  } catch (error) {
    console.error("Error fetching historical Indian earthquake data:", error);
    throw error;
  }
};
