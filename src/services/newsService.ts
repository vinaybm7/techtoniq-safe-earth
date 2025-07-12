
interface NewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
  location?: {
    country: string;
    region: string;
    coordinates?: [number, number];
  };
  magnitude?: number;
  depth?: number;
}

interface USGSEarthquake {
  id: string;
  properties: {
    mag: number;
    place: string;
    time: number;
    url: string;
    detail: string;
    title: string;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

interface EMSCEarthquake {
  id: string;
  properties: {
    magnitude: number;
    place: string;
    time: number;
    url: string;
    title: string;
  };
  geometry: {
    coordinates: [number, number, number];
  };
}

interface IRISEvent {
  id: string;
  magnitude: number;
  location: string;
  time: string;
  depth: number;
  coordinates: [number, number];
}

// Helper function to check if location is in India
const isLocationInIndia = (place: string): boolean => {
  const indiaKeywords = [
    'india', 'indian', 'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 
    'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara', 'ghaziabad',
    'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan',
    'vasai', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh',
    'guwahati', 'solapur', 'hubli', 'mysore', 'gurgaon', 'noida', 'greater noida',
    'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra',
    'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'bihar', 'west bengal',
    'odisha', 'assam', 'punjab', 'haryana', 'himachal pradesh', 'uttarakhand',
    'jharkhand', 'chhattisgarh', 'goa', 'manipur', 'meghalaya', 'tripura',
    'nagaland', 'arunachal pradesh', 'mizoram', 'sikkim', 'andaman', 'nicobar',
    'lakshadweep', 'dadra', 'nagar haveli', 'daman', 'diu', 'chandigarh',
    'delhi ncr', 'ncr', 'national capital region'
  ];
  
  return indiaKeywords.some(keyword => 
    place.toLowerCase().includes(keyword.toLowerCase())
  );
};

// Helper function to create news article from earthquake data
const createNewsArticle = (
  earthquake: USGSEarthquake | EMSCEarthquake | IRISEvent,
  source: string,
  sourceUrl: string
): NewsArticle => {
  const isIndia = isLocationInIndia(earthquake.properties?.place || earthquake.location || '');
  
  return {
    id: earthquake.id,
    title: earthquake.properties?.title || `Earthquake of magnitude ${earthquake.magnitude || earthquake.properties?.mag} in ${earthquake.properties?.place || earthquake.location}`,
    description: `A ${earthquake.magnitude || earthquake.properties?.mag} magnitude earthquake occurred in ${earthquake.properties?.place || earthquake.location}. ${isIndia ? 'This event occurred in India.' : ''}`,
    content: `Earthquake Details: Magnitude ${earthquake.magnitude || earthquake.properties?.mag}, Location: ${earthquake.properties?.place || earthquake.location}, Depth: ${earthquake.depth || earthquake.geometry?.coordinates?.[2] || 'Unknown'} km`,
    url: earthquake.properties?.url || earthquake.url || `https://earthquake.usgs.gov/earthquakes/eventpage/${earthquake.id}`,
    image: '/placeholder.svg', // Default placeholder image
    publishedAt: new Date(earthquake.properties?.time || earthquake.time).toISOString(),
    source: {
      name: source,
      url: sourceUrl
    },
    location: {
      country: isIndia ? 'India' : 'Unknown',
      region: earthquake.properties?.place || earthquake.location || 'Unknown'
    },
    magnitude: earthquake.magnitude || earthquake.properties?.mag,
    depth: earthquake.depth || earthquake.geometry?.coordinates?.[2]
  };
};

// Fetch from USGS API
const fetchUSGSEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson'
    );
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.features
      .filter((quake: USGSEarthquake) => quake.properties.mag >= 4.0) // Filter significant earthquakes
      .slice(0, 15) // Limit to 15 most recent
      .map((quake: USGSEarthquake) => 
        createNewsArticle(quake, 'USGS Earthquake Hazards Program', 'https://earthquake.usgs.gov')
      );
  } catch (error) {
    console.error('Error fetching USGS earthquakes:', error);
    return [];
  }
};

// Fetch from EMSC API
const fetchEMSCEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://www.seismicportal.eu/fdsnws/event/1/query?starttime=2024-01-01&endtime=2025-12-31&minmag=4.0&format=json'
    );
    
    if (!response.ok) {
      throw new Error(`EMSC API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.features
      .slice(0, 10) // Limit to 10 most recent
      .map((quake: EMSCEarthquake) => 
        createNewsArticle(quake, 'European-Mediterranean Seismological Centre', 'https://www.emsc-csem.org')
      );
  } catch (error) {
    console.error('Error fetching EMSC earthquakes:', error);
    return [];
  }
};

// Fetch from IRIS Web Services
const fetchIRISEvents = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://service.iris.edu/fdsnws/event/1/query?starttime=2024-01-01&endtime=2025-12-31&minmag=4.0&format=json'
    );
    
    if (!response.ok) {
      throw new Error(`IRIS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.features
      .slice(0, 10) // Limit to 10 most recent
      .map((quake: IRISEvent) => 
        createNewsArticle(quake, 'IRIS (Incorporated Research Institutions for Seismology)', 'https://www.iris.edu')
      );
  } catch (error) {
    console.error('Error fetching IRIS events:', error);
    return [];
  }
};

// Main function to fetch all earthquake news
export const fetchEarthquakeNews = async (): Promise<NewsArticle[]> => {
  try {
    // Fetch from all sources concurrently
    const [usgsQuakes, emscQuakes, irisEvents] = await Promise.allSettled([
      fetchUSGSEarthquakes(),
      fetchEMSCEarthquakes(),
      fetchIRISEvents()
    ]);

    // Combine all successful results
    const allQuakes: NewsArticle[] = [];
    
    if (usgsQuakes.status === 'fulfilled') {
      allQuakes.push(...usgsQuakes.value);
    }
    
    if (emscQuakes.status === 'fulfilled') {
      allQuakes.push(...emscQuakes.value);
    }
    
    if (irisEvents.status === 'fulfilled') {
      allQuakes.push(...irisEvents.value);
    }

    // Remove duplicates based on ID
    const uniqueQuakes = allQuakes.filter((quake, index, self) => 
      index === self.findIndex(q => q.id === quake.id)
    );

    // Sort by priority: India first, then by magnitude, then by date
    const sortedQuakes = uniqueQuakes.sort((a, b) => {
      const aIsIndia = isLocationInIndia(a.location?.region || '');
      const bIsIndia = isLocationInIndia(b.location?.region || '');
      
      // India earthquakes first
      if (aIsIndia && !bIsIndia) return -1;
      if (!aIsIndia && bIsIndia) return 1;
      
      // Then by magnitude (higher first)
      const magnitudeDiff = (b.magnitude || 0) - (a.magnitude || 0);
      if (magnitudeDiff !== 0) return magnitudeDiff;
      
      // Then by date (newer first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Return top 20 articles
    return sortedQuakes.slice(0, 20);
    
  } catch (error) {
    console.error('Error fetching earthquake news:', error);
    return [];
  }
};

// Additional function to get India-specific earthquakes
export const fetchIndiaEarthquakes = async (): Promise<NewsArticle[]> => {
  const allQuakes = await fetchEarthquakeNews();
  return allQuakes.filter(quake => 
    isLocationInIndia(quake.location?.region || '')
  );
};
