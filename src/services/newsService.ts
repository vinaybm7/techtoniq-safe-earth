
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
  type: 'seismic' | 'news'; // Distinguish between seismic data and news articles
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

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: Array<{
    source: { id: string; name: string };
    author: string;
    title: string;
    description: string;
    url: string;
    urlToImage: string;
    publishedAt: string;
    content: string;
  }>;
}

interface GuardianResponse {
  response: {
    status: string;
    total: number;
    results: Array<{
      id: string;
      type: string;
      sectionId: string;
      sectionName: string;
      webPublicationDate: string;
      webTitle: string;
      webUrl: string;
      apiUrl: string;
      fields?: {
        thumbnail?: string;
        bodyText?: string;
      };
    }>;
  };
}

// Enhanced India detection with more comprehensive keywords and coordinates
const isLocationInIndia = (place: string, coordinates?: [number, number]): boolean => {
  // Check coordinates first (India's rough boundaries)
  if (coordinates) {
    const [lon, lat] = coordinates;
    // India's approximate boundaries: 68°E to 97°E, 8°N to 37°N
    if (lon >= 68 && lon <= 97 && lat >= 8 && lat <= 37) {
      return true;
    }
  }

  const indiaKeywords = [
    // Major cities
    'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad', 
    'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 
    'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 
    'rajkot', 'kalyan', 'vasai', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 
    'chandigarh', 'guwahati', 'solapur', 'hubli', 'mysore', 'gurgaon', 'noida', 'greater noida',
    
    // States and Union Territories
    'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra',
    'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'bihar', 'west bengal',
    'odisha', 'assam', 'punjab', 'haryana', 'himachal pradesh', 'uttarakhand',
    'jharkhand', 'chhattisgarh', 'goa', 'manipur', 'meghalaya', 'tripura',
    'nagaland', 'arunachal pradesh', 'mizoram', 'sikkim', 'andaman', 'nicobar',
    'lakshadweep', 'dadra', 'nagar haveli', 'daman', 'diu', 'chandigarh',
    
    // Regions and areas
    'delhi ncr', 'ncr', 'national capital region', 'konkan', 'malabar', 'coromandel',
    'deccan', 'gangetic', 'himalayan', 'northeast', 'north east', 'south india',
    'north india', 'east india', 'west india', 'central india',
    
    // Common terms
    'india', 'indian', 'bharat', 'hindustan', 'republic of india',
    
    // Recent earthquake-prone areas
    'uttarakhand', 'himachal', 'kashmir', 'ladakh', 'sikkim', 'assam', 'manipur',
    'mizoram', 'nagaland', 'arunachal', 'meghalaya', 'tripura', 'bihar', 'nepal border',
    'china border', 'pakistan border', 'bangladesh border', 'myanmar border'
  ];
  
  const searchText = place.toLowerCase();
  return indiaKeywords.some(keyword => searchText.includes(keyword.toLowerCase()));
};

// Helper function to create news article from earthquake data
const createSeismicArticle = (
  earthquake: USGSEarthquake | EMSCEarthquake | IRISEvent,
  source: string,
  sourceUrl: string
): NewsArticle => {
  const coordinates = earthquake.geometry?.coordinates || earthquake.coordinates;
  const isIndia = isLocationInIndia(
    earthquake.properties?.place || earthquake.location || '', 
    coordinates
  );
  
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
    depth: earthquake.depth || earthquake.geometry?.coordinates?.[2],
    type: 'seismic'
  };
};

// Helper function to create news article from news API
const createNewsArticle = (
  article: any,
  source: string,
  sourceUrl: string
): NewsArticle => {
  const isIndia = isLocationInIndia(
    article.title + ' ' + article.description + ' ' + (article.content || '')
  );
  
  return {
    id: article.id || Math.random().toString(36).substr(2, 9),
    title: article.title || article.webTitle,
    description: article.description || article.fields?.bodyText?.substring(0, 200) + '...' || 'No description available',
    content: article.content || article.fields?.bodyText || article.description || 'No content available',
    url: article.url || article.webUrl,
    image: article.urlToImage || article.fields?.thumbnail || '/placeholder.svg',
    publishedAt: article.publishedAt || article.webPublicationDate,
    source: {
      name: source,
      url: sourceUrl
    },
    location: {
      country: isIndia ? 'India' : 'Unknown',
      region: 'Unknown'
    },
    type: 'news'
  };
};

// Fetch from USGS API with broader time range and lower magnitude threshold
const fetchUSGSEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    // Fetch last 7 days of data to catch more recent earthquakes
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
    );
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.features
      .filter((quake: USGSEarthquake) => quake.properties.mag >= 3.0) // Lower threshold to catch more events
      .slice(0, 20) // Limit to 20 most recent
      .map((quake: USGSEarthquake) => 
        createSeismicArticle(quake, 'USGS Earthquake Hazards Program', 'https://earthquake.usgs.gov')
      );
  } catch (error) {
    console.error('Error fetching USGS earthquakes:', error);
    return [];
  }
};

// Fetch from EMSC API with broader search
const fetchEMSCEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://www.seismicportal.eu/fdsnws/event/1/query?starttime=2024-01-01&endtime=2025-12-31&minmag=3.0&format=json'
    );
    
    if (!response.ok) {
      throw new Error(`EMSC API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.features
      .slice(0, 15) // Limit to 15 most recent
      .map((quake: EMSCEarthquake) => 
        createSeismicArticle(quake, 'European-Mediterranean Seismological Centre', 'https://www.emsc-csem.org')
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
      'https://service.iris.edu/fdsnws/event/1/query?starttime=2024-01-01&endtime=2025-12-31&minmag=3.0&format=json'
    );
    
    if (!response.ok) {
      throw new Error(`IRIS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.features
      .slice(0, 15) // Limit to 15 most recent
      .map((quake: IRISEvent) => 
        createSeismicArticle(quake, 'IRIS (Incorporated Research Institutions for Seismology)', 'https://www.iris.edu')
      );
  } catch (error) {
    console.error('Error fetching IRIS events:', error);
    return [];
  }
};

// Fetch from The Guardian API (free, no key required)
const fetchGuardianNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://content.guardianapis.com/search?q=earthquake&section=world&show-fields=thumbnail,bodyText&api-key=test'
    );
    
    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }
    
    const data: GuardianResponse = await response.json();
    return data.response.results
      .slice(0, 15)
      .map(article => 
        createNewsArticle(article, 'The Guardian', 'https://www.theguardian.com')
      );
  } catch (error) {
    console.error('Error fetching Guardian news:', error);
    return [];
  }
};

// Fetch from Reuters RSS feed (simplified)
const fetchReutersNews = async (): Promise<NewsArticle[]> => {
  try {
    // Using a CORS proxy to fetch RSS feed
    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/Reuters/worldNews'
    );
    
    if (!response.ok) {
      throw new Error(`Reuters RSS error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items
      .filter((item: any) => 
        item.title.toLowerCase().includes('earthquake') || 
        item.description.toLowerCase().includes('earthquake')
      )
      .slice(0, 15)
      .map((item: any) => 
        createNewsArticle(item, 'Reuters', 'https://www.reuters.com')
      );
  } catch (error) {
    console.error('Error fetching Reuters news:', error);
    return [];
  }
};

// Fetch from Times of India RSS (India-specific news)
const fetchTimesOfIndiaNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://timesofindia.indiatimes.com/rssfeedstopstories.cms'
    );
    
    if (!response.ok) {
      throw new Error(`Times of India RSS error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items
      .filter((item: any) => 
        item.title.toLowerCase().includes('earthquake') || 
        item.description.toLowerCase().includes('earthquake') ||
        item.title.toLowerCase().includes('quake') ||
        item.description.toLowerCase().includes('quake')
      )
      .slice(0, 10)
      .map((item: any) => 
        createNewsArticle(item, 'Times of India', 'https://timesofindia.indiatimes.com')
      );
  } catch (error) {
    console.error('Error fetching Times of India news:', error);
    return [];
  }
};

// Fetch from Hindustan Times RSS (India-specific news)
const fetchHindustanTimesNews = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml'
    );
    
    if (!response.ok) {
      throw new Error(`Hindustan Times RSS error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.items
      .filter((item: any) => 
        item.title.toLowerCase().includes('earthquake') || 
        item.description.toLowerCase().includes('earthquake') ||
        item.title.toLowerCase().includes('quake') ||
        item.description.toLowerCase().includes('quake')
      )
      .slice(0, 10)
      .map((item: any) => 
        createNewsArticle(item, 'Hindustan Times', 'https://www.hindustantimes.com')
      );
  } catch (error) {
    console.error('Error fetching Hindustan Times news:', error);
    return [];
  }
};

// Main function to fetch all earthquake news
export const fetchEarthquakeNews = async (): Promise<NewsArticle[]> => {
  try {
    // Fetch from all sources concurrently
    const [usgsQuakes, emscQuakes, irisEvents, guardianNews, reutersNews, toiNews, htNews] = await Promise.allSettled([
      fetchUSGSEarthquakes(),
      fetchEMSCEarthquakes(),
      fetchIRISEvents(),
      fetchGuardianNews(),
      fetchReutersNews(),
      fetchTimesOfIndiaNews(),
      fetchHindustanTimesNews()
    ]);

    // Combine all successful results
    const allArticles: NewsArticle[] = [];
    
    if (usgsQuakes.status === 'fulfilled') {
      allArticles.push(...usgsQuakes.value);
    }
    
    if (emscQuakes.status === 'fulfilled') {
      allArticles.push(...emscQuakes.value);
    }
    
    if (irisEvents.status === 'fulfilled') {
      allArticles.push(...irisEvents.value);
    }
    
    if (guardianNews.status === 'fulfilled') {
      allArticles.push(...guardianNews.value);
    }
    
    if (reutersNews.status === 'fulfilled') {
      allArticles.push(...reutersNews.value);
    }
    
    if (toiNews.status === 'fulfilled') {
      allArticles.push(...toiNews.value);
    }
    
    if (htNews.status === 'fulfilled') {
      allArticles.push(...htNews.value);
    }

    // Remove duplicates based on ID
    const uniqueArticles = allArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    );

    // Sort by priority: India first, then by type (news first), then by date
    const sortedArticles = uniqueArticles.sort((a, b) => {
      const aIsIndia = isLocationInIndia(a.location?.region || '');
      const bIsIndia = isLocationInIndia(b.location?.region || '');
      
      // India articles first
      if (aIsIndia && !bIsIndia) return -1;
      if (!aIsIndia && bIsIndia) return 1;
      
      // Then by type (news articles first, then seismic data)
      if (a.type === 'news' && b.type === 'seismic') return -1;
      if (a.type === 'seismic' && b.type === 'news') return 1;
      
      // Then by date (newer first)
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
    });

    // Return top 40 articles
    return sortedArticles.slice(0, 40);
    
  } catch (error) {
    console.error('Error fetching earthquake news:', error);
    return [];
  }
};

// Additional function to get India-specific earthquakes
export const fetchIndiaEarthquakes = async (): Promise<NewsArticle[]> => {
  const allArticles = await fetchEarthquakeNews();
  return allArticles.filter(article => 
    isLocationInIndia(article.location?.region || '')
  );
};

// Function to get only news articles (not seismic data)
export const fetchNewsOnly = async (): Promise<NewsArticle[]> => {
  const allArticles = await fetchEarthquakeNews();
  return allArticles.filter(article => article.type === 'news');
};

// Function to get only seismic data
export const fetchSeismicOnly = async (): Promise<NewsArticle[]> => {
  const allArticles = await fetchEarthquakeNews();
  return allArticles.filter(article => article.type === 'seismic');
};
