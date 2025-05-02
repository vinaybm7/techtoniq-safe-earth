
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
}

export const fetchRecentEarthquakes = async (): Promise<Earthquake[]> => {
  try {
    // Fetch from USGS API
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
    );
    const data: USGSResponse = await response.json();
    
    // Map USGS data to our format
    return data.features.map((feature) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      location: feature.properties.place,
      date: new Date(feature.properties.time).toLocaleString(),
      depth: Math.round(feature.geometry.coordinates[2]),
      url: feature.properties.url,
      coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] as [number, number],
      tsunami: feature.properties.tsunami === 1,
      felt: feature.properties.felt,
      significance: feature.properties.sig,
      status: feature.properties.status,
      alert: feature.properties.alert
    }));
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
};

// Function to fetch earthquakes for a specific timeframe
export const fetchEarthquakesByTimeframe = async (timeframe: 'hour' | 'day' | 'week' | 'month'): Promise<Earthquake[]> => {
  try {
    const response = await fetch(
      `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_${timeframe}.geojson`
    );
    const data: USGSResponse = await response.json();
    
    return data.features.map((feature) => ({
      id: feature.id,
      magnitude: feature.properties.mag,
      location: feature.properties.place,
      date: new Date(feature.properties.time).toLocaleString(),
      depth: Math.round(feature.geometry.coordinates[2]),
      url: feature.properties.url,
      coordinates: [feature.geometry.coordinates[0], feature.geometry.coordinates[1]] as [number, number],
      tsunami: feature.properties.tsunami === 1,
      felt: feature.properties.felt,
      significance: feature.properties.sig,
      status: feature.properties.status,
      alert: feature.properties.alert
    }));
  } catch (error) {
    console.error(`Error fetching ${timeframe} earthquake data:`, error);
    throw error;
  }
};
