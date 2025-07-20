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
  url?: string;
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

// Enhanced India detection with more precise matching
const isLocationInIndia = (place: string): boolean => {
  if (!place) return false;
  
  const searchText = place.toLowerCase();
  
  // Strong exclusion terms that indicate non-India locations
  const excludeKeywords = [
    'nepal', 'bangladesh', 'pakistan', 'china', 'sri lanka', 'myanmar', 'bhutan',
    'afghanistan', 'tibet', 'maldives', 'thailand', 'indonesia', 'malaysia',
    'philippines', 'vietnam', 'cambodia', 'laos', 'singapore', 'brunei',
    'indian ocean', 'pacific ocean', 'atlantic ocean', 'mediterranean sea'
  ];
  
  // First check if it contains any exclude keywords
  const hasExcludeKeyword = excludeKeywords.some(keyword => 
    searchText.includes(keyword.toLowerCase())
  );
  
  if (hasExcludeKeyword) return false;
  
  // Specific Indian locations (cities, states, regions)
  const indiaLocations = [
    // Major cities
    'delhi', 'new delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 
    'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'vizag', 'patna', 'vadodara', 
    'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot',
    'kalyan', 'vasai', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 
    'chandigarh', 'guwahati', 'solapur', 'hubli', 'mysore', 'gurgaon', 'gurugram',
    'noida', 'greater noida',
    
    // States and Union Territories
    'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra',
    'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'bihar', 'west bengal',
    'odisha', 'assam', 'punjab', 'haryana', 'himachal pradesh', 'uttarakhand',
    'jharkhand', 'chhattisgarh', 'goa', 'manipur', 'meghalaya', 'tripura',
    'nagaland', 'arunachal pradesh', 'mizoram', 'sikkim', 'andaman and nicobar',
    'lakshadweep', 'dadra and nagar haveli', 'daman and diu', 'jammu and kashmir', 'ladakh',
    
    // Geographic regions specific to India
    'western ghats', 'eastern ghats', 'deccan plateau', 'gangetic plain',
    'thar desert', 'sundarbans', 'nilgiri hills', 'sahyadri mountains',
    'northeast india', 'north east india'
  ];
  
  // Check for specific Indian locations using simple string matching
  const hasIndiaLocation = indiaLocations.some(location => 
    searchText.includes(location.toLowerCase())
  );
  
  if (hasIndiaLocation) return true;
  
  // Check for general India terms with word boundaries
  const generalIndiaTerms = ['india', 'bharat', 'hindustan'];
  return generalIndiaTerms.some(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    return regex.test(searchText);
  });
};

// Helper for India detection in news articles
const isNewsAboutIndia = (text: string): boolean => {
  if (!text) return false;
  
  const lower = text.toLowerCase();
  
  // Strong exclusion terms that indicate non-India content
  const excludeKeywords = [
    'indiana', 'indianapolis', 'american indian', 'native american', 'west indies', 'east indies',
    'indian restaurant', 'indian cuisine', 'indian food', 'indian culture', 'indian festival',
    'indian diaspora', 'indian community in', 'indians in america', 'indians in canada',
    'indians in uk', 'indian-american', 'indian american', 'indian origin', 'nri', 'pio',
    'overseas indian', 'nepal', 'bangladesh', 'pakistan', 'china', 'sri lanka', 'myanmar',
    'bhutan', 'afghanistan', 'tibet', 'maldives', 'thailand', 'indonesia', 'malaysia',
    'philippines', 'vietnam', 'cambodia', 'laos', 'singapore', 'brunei',
    'indian ocean tsunami', 'pacific ocean', 'atlantic ocean', 'mediterranean sea'
  ];
  
  // First check if it contains any exclude keywords
  const hasExcludeKeyword = excludeKeywords.some(keyword => 
    lower.includes(keyword.toLowerCase())
  );
  
  if (hasExcludeKeyword) return false;
  
  // Specific India-related terms with earthquake context
  const indiaEarthquakeTerms = [
    'earthquake in india', 'india earthquake', 'indian earthquake', 'earthquake hits india',
    'earthquake strikes india', 'tremors in india', 'seismic activity in india',
    'earthquake felt in india', 'india seismic', 'indian seismic'
  ];
  
  // Check for specific India earthquake terms first
  if (indiaEarthquakeTerms.some(term => lower.includes(term))) {
    return true;
  }
  
  // Indian cities and states
  const indiaLocations = [
    'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'hyderabad', 
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal',
    'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra',
    'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'bihar', 'west bengal',
    'odisha', 'assam', 'punjab', 'haryana', 'himachal pradesh', 'uttarakhand',
    'jharkhand', 'chhattisgarh', 'goa', 'jammu and kashmir', 'ladakh'
  ];
  
  // Check if it mentions specific Indian locations
  const hasIndiaLocation = indiaLocations.some(location => lower.includes(location));
  
  if (hasIndiaLocation) {
    // Must also have earthquake context
    const earthquakeTerms = ['earthquake', 'quake', 'tremor', 'seismic', 'magnitude'];
    return earthquakeTerms.some(term => lower.includes(term));
  }
  
  // Check for general India terms with strict validation
  const generalIndiaTerms = ['india', 'bharat', 'hindustan'];
  const hasGeneralIndiaTerm = generalIndiaTerms.some(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'i');
    return regex.test(lower);
  });
  
  if (hasGeneralIndiaTerm) {
    // Must also have earthquake context
    const earthquakeTerms = ['earthquake', 'quake', 'tremor', 'seismic', 'magnitude'];
    return earthquakeTerms.some(term => lower.includes(term));
  }
  
  return false;
};
// Hel
per function to create news article from earthquake data
const createSeismicArticle = (
  earthquake: USGSEarthquake | EMSCEarthquake | IRISEvent,
  source: string,
  sourceUrl: string
): NewsArticle => {
  let id: string;
  let title: string;
  let magnitude: number | undefined;
  let place: string;
  let time: number | string;
  let url: string;
  let depth: number | undefined;
  let coordinates: [number, number] | undefined;

  if ('properties' in earthquake) { // USGSEarthquake or EMSCEarthquake
    id = earthquake.id;
    // Get magnitude from either mag or magnitude property
    const properties = earthquake.properties;
    const quakeMagnitude = ('mag' in properties) ? properties.mag : properties.magnitude;
    
    // Get place and format title
    place = earthquake.properties.place;
    title = earthquake.properties.title || 
            `Earthquake of magnitude ${quakeMagnitude} in ${place}`;
    magnitude = quakeMagnitude;
    time = earthquake.properties.time;
    url = earthquake.properties.url;
    coordinates = [earthquake.geometry.coordinates[0], earthquake.geometry.coordinates[1]];
    depth = earthquake.geometry.coordinates?.[2];
  } else { // IRISEvent
    id = earthquake.id;
    title = `Earthquake of magnitude ${earthquake.magnitude} in ${earthquake.location}`;
    magnitude = earthquake.magnitude;
    place = earthquake.location;
    time = earthquake.time;
    url = earthquake.url || `https://service.iris.edu/fdsnws/event/1/query?eventid=${earthquake.id}`;
    coordinates = earthquake.coordinates;
    depth = earthquake.depth;
  }

  const isIndia = isLocationInIndia(place);
  
  return {
    id: id,
    title: title,
    description: `A ${magnitude} magnitude earthquake occurred in ${place}. ${isIndia ? 'This event occurred in India.' : ''}`,
    content: `Earthquake Details: Magnitude ${magnitude}, Location: ${place}, Depth: ${depth || 'Unknown'} km`,
    url: url,
    image: '/placeholder.svg', // Default placeholder image
    publishedAt: new Date(time).toISOString(),
    source: {
      name: source,
      url: sourceUrl
    },
    location: {
      country: isIndia ? 'India' : 'Unknown',
      region: place || 'Unknown'
    },
    magnitude: magnitude,
    depth: depth,
    type: 'seismic'
  };
};

// Helper function to create news article from news API
const createNewsArticle = (
  article: any,
  source: string,
  sourceUrl: string
): NewsArticle => {
  const isIndia = isNewsAboutIndia(
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
      country: source.includes('India') || source.includes('Hindustan Times') ? 'India' : (isIndia ? 'India' : 'Unknown'),
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

// Fetch from NewsAPI.org (worldwide earthquake news)
const fetchNewsApiOrg = async (): Promise<NewsArticle[]> => {
  try {
    const worldUrl = 'https://newsapi.org/v2/everything?q=earthquake&language=en&sortBy=publishedAt&pageSize=20&apiKey=d4b87e3551324d55b23a8b04822bd917';
    const response = await fetch(worldUrl);
    const data = response.ok ? await response.json() : { articles: [] };
    return data.articles
      .filter((item: any) =>
        (item.title && item.title.toLowerCase().includes('earthquake')) ||
        (item.description && item.description.toLowerCase().includes('earthquake'))
      )
      .map((item: any) => {
        const text = `${item.title} ${item.description} ${item.content}`;
        return {
          id: item.url || Math.random().toString(36).substr(2, 9),
          title: item.title,
          description: item.description || '',
          content: item.content || item.description || '',
          url: item.url,
          image: item.urlToImage || '/placeholder.svg',
          publishedAt: item.publishedAt,
          source: {
            name: 'NewsAPI.org',
            url: 'https://newsapi.org/'
          },
          location: {
            country: isNewsAboutIndia(text) ? 'India' : 'Unknown',
            region: isNewsAboutIndia(text) ? 'India' : 'Unknown'
          },
          type: 'news'
        };
      });
  } catch (error) {
    console.error('Error fetching NewsAPI.org news:', error);
    return [];
  }
};

// Fetch from NewsAPI.org (India-specific earthquake news)
const fetchNewsApiOrgIndia = async (): Promise<NewsArticle[]> => {
  try {
    const indiaUrl = 'https://newsapi.org/v2/everything?q=earthquake&language=en&sortBy=publishedAt&pageSize=20&apiKey=d4b87e3551324d55b23a8b04822bd917&country=in';
    const response = await fetch(indiaUrl);
    const data = response.ok ? await response.json() : { articles: [] };
    return data.articles
      .filter((item: any) =>
        (item.title && item.title.toLowerCase().includes('earthquake')) ||
        (item.description && item.description.toLowerCase().includes('earthquake'))
      )
      .map((item: any) => {
        return {
          id: item.url || Math.random().toString(36).substr(2, 9),
          title: item.title,
          description: item.description || '',
          content: item.content || item.description || '',
          url: item.url,
          image: item.urlToImage || '/placeholder.svg',
          publishedAt: item.publishedAt,
          source: {
            name: 'NewsAPI.org',
            url: 'https://newsapi.org/'
          },
          location: {
            country: 'India',
            region: 'Unknown' // Specific region might not be available from API
          },
          type: 'news'
        };
      });
  } catch (error) {
    console.error('Error fetching NewsAPI.org India news:', error);
    return [];
  }
};

// Fetch from GNews (worldwide earthquake news)
const fetchGNews = async (): Promise<NewsArticle[]> => {
  try {
    const worldUrl = 'https://gnews.io/api/v4/search?q=earthquake&lang=en&max=20&apikey=0f2829470d1cca9155f182ffab0cb3b2';
    const response = await fetch(worldUrl);
    const data = response.ok ? await response.json() : { articles: [] };
    return data.articles
      .filter((item: any) =>
        (item.title && item.title.toLowerCase().includes('earthquake')) ||
        (item.description && item.description.toLowerCase().includes('earthquake'))
      )
      .map((item: any) => {
        const text = `${item.title} ${item.description} ${item.content}`;
        return {
          id: item.url || Math.random().toString(36).substr(2, 9),
          title: item.title,
          description: item.description || '',
          content: item.content || item.description || '',
          url: item.url,
          image: item.image || '/placeholder.svg',
          publishedAt: item.publishedAt,
          source: {
            name: 'GNews',
            url: 'https://gnews.io/'
          },
          location: {
            country: isNewsAboutIndia(text) ? 'India' : 'Unknown',
            region: isNewsAboutIndia(text) ? 'India' : 'Unknown'
          },
          type: 'news'
        };
      });
  } catch (error) {
    console.error('Error fetching GNews news:', error);
    return [];
  }
};

// Fetch from GNews (India-specific earthquake news)
const fetchGNewsIndia = async (): Promise<NewsArticle[]> => {
  try {
    const indiaUrl = 'https://gnews.io/api/v4/search?q=earthquake&lang=en&country=in&max=20&apikey=0f2829470d1cca9155f182ffab0cb3b2';
    const response = await fetch(indiaUrl);
    const data = response.ok ? await response.json() : { articles: [] };
    return data.articles
      .filter((item: any) =>
        (item.title && item.title.toLowerCase().includes('earthquake')) ||
        (item.description && item.description.toLowerCase().includes('earthquake'))
      )
      .map((item: any) => {
        return {
          id: item.url || Math.random().toString(36).substr(2, 9),
          title: item.title,
          description: item.description || '',
          content: item.content || item.description || '',
          url: item.url,
          image: item.image || '/placeholder.svg',
          publishedAt: item.publishedAt,
          source: {
            name: 'GNews',
            url: 'https://gnews.io/'
          },
          location: {
            country: 'India',
            region: 'Unknown' // Specific region might not be available from API
          },
          type: 'news'
        };
      });
  } catch (error) {
    console.error('Error fetching GNews India news:', error);
    return [];
  }
};

// Fetch from Current News API (worldwide earthquake news)
const fetchCurrentNewsApi = async (): Promise<NewsArticle[]> => {
  try {
    const worldUrl = 'https://api.currentsapi.services/v1/search?apiKey=qVWbmf0_0vrdrjVZ5BNc5MqMf4lwI0GVeSSl3VRMaZjeNwum&language=en&keywords=earthquake';
    const response = await fetch(worldUrl);
    const data = response.ok ? await response.json() : { news: [] };
    return data.news
      .filter((item: any) =>
        (item.title && item.title.toLowerCase().includes('earthquake')) ||
        (item.description && item.description.toLowerCase().includes('earthquake'))
      )
      .map((item: any) => {
        const text = `${item.title} ${item.description} ${item.content}`;
        return {
          id: item.url || item.id || Math.random().toString(36).substr(2, 9),
          title: item.title,
          description: item.description || '',
          content: item.description || '',
          url: item.url || item.url,
          image: item.image || '/placeholder.svg',
          publishedAt: item.published || item.publishedAt,
          source: {
            name: 'CurrentsAPI',
            url: 'https://currentsapi.services/'
          },
          location: {
            country: isNewsAboutIndia(text) ? 'India' : 'Unknown',
            region: isNewsAboutIndia(text) ? 'India' : 'Unknown'
          },
          type: 'news'
        };
      });
  } catch (error) {
    console.error('Error fetching CurrentsAPI news:', error);
    return [];
  }
};

// Fetch from Current News API (India-specific earthquake news)
const fetchCurrentNewsApiIndia = async (): Promise<NewsArticle[]> => {
  try {
    const indiaUrl = 'https://api.currentsapi.services/v1/search?apiKey=qVWbmf0_0vrdrjVZ5BNc5MqMf4lwI0GVeSSl3VRMaZjeNwum&language=en&country=IN&keywords=earthquake';
    const response = await fetch(indiaUrl);
    const data = response.ok ? await response.json() : { news: [] };
    return data.news
      .filter((item: any) =>
        (item.title && item.title.toLowerCase().includes('earthquake')) ||
        (item.description && item.description.toLowerCase().includes('earthquake'))
      )
      .map((item: any) => {
        return {
          id: item.url || item.id || Math.random().toString(36).substr(2, 9),
          title: item.title,
          description: item.description || '',
          content: item.description || '',
          url: item.url || item.url,
          image: item.image || '/placeholder.svg',
          publishedAt: item.published || item.publishedAt,
          source: {
            name: 'CurrentsAPI',
            url: 'https://currentsapi.services/'
          },
          location: {
            country: 'India',
            region: 'Unknown' // Specific region might not be available from API
          },
          type: 'news'
        };
      });
  } catch (error) {
    console.error('Error fetching CurrentsAPI India news:', error);
    return [];
  }
};

// Priority-based API fetching with timeout and cancellation
const fetchWithTimeout = async <T>(fetchFn: () => Promise<T>, timeout: number = 10000): Promise<T> => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const result = await fetchFn();
    clearTimeout(timeoutId);
    return result;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
};

// Optimized progressive loading with priority tiers
export const fetchEarthquakeNews = async (onProgress?: (articles: NewsArticle[]) => void): Promise<NewsArticle[]> => {
  const allArticles: NewsArticle[] = [];
  const seenIds = new Set<string>();

  // Helper function to add articles and remove duplicates
  const addArticles = (articles: NewsArticle[]) => {
    const newArticles = articles.filter(article => {
      if (seenIds.has(article.id)) return false;
      seenIds.add(article.id);
      return true;
    });
    allArticles.push(...newArticles);
    
    // Sort articles by priority in-place
    allArticles.sort((a, b) => {
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
    
    // Notify progress with top 40 articles
    if (onProgress) {
      onProgress(allArticles.slice(0, 40));
    }
  };

  try {
    // TIER 1: Critical sources (fastest, most reliable) - 5 second timeout
    const tier1Sources = [
      () => fetchUSGSEarthquakes(),
      () => fetchTimesOfIndiaNews(),
      () => fetchHindustanTimesNews()
    ];

    // TIER 2: Important sources - 8 second timeout
    const tier2Sources = [
      () => fetchEMSCEarthquakes(),
      () => fetchGuardianNews(),
      () => fetchNewsApiOrg()
    ];

    // TIER 3: Additional sources - 12 second timeout
    const tier3Sources = [
      () => fetchReutersNews(),
      () => fetchGNews(),
      () => fetchNewsApiOrgIndia()
    ];

    // TIER 4: Optional sources - 15 second timeout
    const tier4Sources = [
      () => fetchIRISEvents(),
      () => fetchCurrentNewsApi(),
      () => fetchGNewsIndia(),
      () => fetchCurrentNewsApiIndia()
    ];

    // Fetch Tier 1 first (most critical)
    const tier1Results = await Promise.allSettled(
      tier1Sources.map(fn => fetchWithTimeout(fn, 5000))
    );
    
    tier1Results.forEach(result => {
      if (result.status === 'fulfilled') {
        addArticles(result.value);
      }
    });

    // Fetch Tier 2 concurrently with Tier 3 & 4 (but prioritize Tier 2)
    const [tier2Results, tier3Results] = await Promise.all([
      Promise.allSettled(tier2Sources.map(fn => fetchWithTimeout(fn, 8000))),
      Promise.allSettled(tier3Sources.map(fn => fetchWithTimeout(fn, 12000)))
    ]);

    // Process Tier 2 results
    tier2Results.forEach(result => {
      if (result.status === 'fulfilled') {
        addArticles(result.value);
      }
    });

    // Process Tier 3 results
    tier3Results.forEach(result => {
      if (result.status === 'fulfilled') {
        addArticles(result.value);
      }
    });

    // Fetch Tier 4 in background (optional)
    Promise.allSettled(tier4Sources.map(fn => fetchWithTimeout(fn, 15000)))
      .then(tier4Results => {
        tier4Results.forEach(result => {
          if (result.status === 'fulfilled') {
            addArticles(result.value);
          }
        });
      })
      .catch(error => {
        console.warn('Tier 4 sources failed:', error);
      });

    // Return the current best articles (limit to 40)
    return allArticles.slice(0, 40);
    
  } catch (error) {
    console.error('Error fetching earthquake news:', error);
    return allArticles.slice(0, 40); // Return whatever we have
  }
};

// Additional function to get India-specific earthquakes
export const fetchIndiaEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const [toiNews, htNews, newsApiOrgIndiaNews, gnewsIndiaNews, currentNewsApiIndiaNews] = await Promise.allSettled([
      fetchTimesOfIndiaNews(),
      fetchHindustanTimesNews(),
      fetchNewsApiOrgIndia(),
      fetchGNewsIndia(),
      fetchCurrentNewsApiIndia()
    ]);

    const indiaArticles: NewsArticle[] = [];
    if (toiNews.status === 'fulfilled') {
      indiaArticles.push(...toiNews.value);
    }
    if (htNews.status === 'fulfilled') {
      indiaArticles.push(...htNews.value);
    }
    if (newsApiOrgIndiaNews.status === 'fulfilled') {
      indiaArticles.push(...newsApiOrgIndiaNews.value);
    }
    if (gnewsIndiaNews.status === 'fulfilled') {
      indiaArticles.push(...gnewsIndiaNews.value);
    }
    if (currentNewsApiIndiaNews.status === 'fulfilled') {
      indiaArticles.push(...currentNewsApiIndiaNews.value);
    }

    // Remove duplicates based on ID
    const uniqueIndiaArticles = indiaArticles.filter((article, index, self) => 
      index === self.findIndex(a => a.id === article.id)
    );

    // Sort by date (newer first)
    return uniqueIndiaArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());

  } catch (error) {
    console.error('Error fetching India-specific news:', error);
    return [];
  }
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