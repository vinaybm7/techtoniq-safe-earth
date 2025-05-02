
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

export const fetchRecentEarthquakes = async () => {
  try {
    const response = await fetch(
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson"
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
    }));
  } catch (error) {
    console.error("Error fetching earthquake data:", error);
    throw error;
  }
};
