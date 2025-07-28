// Client-side news service that uses backend API endpoints
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
  type: 'seismic' | 'news';
}

// Fallback news data for when APIs fail
const fallbackNews: NewsArticle[] = [
  {
    id: 'fallback-1',
    title: 'Earthquake Monitoring Systems Worldwide',
    description: 'Global seismic monitoring networks continue to track earthquake activity across the world.',
    content: 'Seismic monitoring stations worldwide work 24/7 to detect and analyze earthquake activity.',
    url: 'https://earthquake.usgs.gov',
    image: '/placeholder.svg',
    publishedAt: new Date().toISOString(),
    source: {
      name: 'USGS',
      url: 'https://earthquake.usgs.gov'
    },
    location: {
      country: 'Global',
      region: 'Worldwide'
    },
    type: 'news'
  },
  {
    id: 'fallback-2',
    title: 'Seismic Activity in the Ring of Fire',
    description: 'The Pacific Ring of Fire continues to show regular seismic activity.',
    content: 'The Ring of Fire is a region around the Pacific Ocean where many earthquakes and volcanic eruptions occur.',
    url: 'https://www.emsc-csem.org',
    image: '/placeholder.svg',
    publishedAt: new Date().toISOString(),
    source: {
      name: 'EMSC',
      url: 'https://www.emsc-csem.org'
    },
    location: {
      country: 'Pacific',
      region: 'Ring of Fire'
    },
    type: 'news'
  }
];

// Simple USGS earthquake data fetcher (works without CORS issues)
const fetchUSGSEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.features
      .filter((quake: any) => quake.properties.mag >= 3.0)
      .slice(0, 20)
      .map((quake: any) => ({
        id: quake.id,
        title: quake.properties.title || `Earthquake M${quake.properties.mag} - ${quake.properties.place}`,
        description: `A magnitude ${quake.properties.mag} earthquake occurred in ${quake.properties.place}`,
        content: `Earthquake Details: Magnitude ${quake.properties.mag}, Location: ${quake.properties.place}, Depth: ${quake.geometry.coordinates[2] || 'Unknown'} km`,
        url: quake.properties.url,
        image: '/placeholder.svg',
        publishedAt: new Date(quake.properties.time).toISOString(),
        source: {
          name: 'USGS Earthquake Hazards Program',
          url: 'https://earthquake.usgs.gov'
        },
        location: {
          country: quake.properties.place?.toLowerCase().includes('india') ? 'India' : 'Unknown',
          region: quake.properties.place || 'Unknown'
        },
        magnitude: quake.properties.mag,
        depth: quake.geometry.coordinates[2],
        type: 'seismic' as const
      }));
  } catch (error) {
    console.error('Error fetching USGS earthquakes:', error);
    return [];
  }
};

// Fetch earthquake news from backend API
export const fetchEarthquakeNews = async (): Promise<NewsArticle[]> => {
  try {
    // Try to get USGS data first (most reliable)
    const usgsData = await fetchUSGSEarthquakes();
    
    // If we have USGS data, return it
    if (usgsData.length > 0) {
      return usgsData;
    }
    
    // Fallback to backend API if available
    try {
      const response = await fetch('/api/news/earthquake');
      if (response.ok) {
        const data = await response.json();
        return data.length > 0 ? data : fallbackNews;
      }
    } catch (apiError) {
      console.warn('Backend API not available:', apiError);
    }
    
    // Return fallback news if all else fails
    return fallbackNews;
  } catch (error) {
    console.error('Error fetching earthquake news:', error);
    return fallbackNews;
  }
};

// Fetch India-specific earthquake news
export const fetchIndiaEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    // Get USGS data and filter for India
    const usgsData = await fetchUSGSEarthquakes();
    const indiaData = usgsData.filter(article => 
      article.location?.country === 'India' || 
      article.location?.region?.toLowerCase().includes('india')
    );
    
    if (indiaData.length > 0) {
      return indiaData;
    }
    
    // Fallback to backend API
    try {
      const response = await fetch('/api/news/india');
      if (response.ok) {
        const data = await response.json();
        return data.length > 0 ? data : fallbackNews.filter(item => 
          item.location?.country === 'India'
        );
      }
    } catch (apiError) {
      console.warn('Backend API not available:', apiError);
    }
    
    // Return India-specific fallback
    return fallbackNews.filter(item => 
      item.location?.country === 'India' || 
      item.location?.region?.toLowerCase().includes('india')
    );
  } catch (error) {
    console.error('Error fetching India earthquake news:', error);
    return fallbackNews;
  }
};

// Fetch only news articles (no seismic data)
export const fetchNewsOnly = async (): Promise<NewsArticle[]> => {
  const allNews = await fetchEarthquakeNews();
  return allNews.filter(article => article.type === 'news');
};

// Fetch only seismic data
export const fetchSeismicOnly = async (): Promise<NewsArticle[]> => {
  const allNews = await fetchEarthquakeNews();
  return allNews.filter(article => article.type === 'seismic');
};

export default {
  fetchEarthquakeNews,
  fetchIndiaEarthquakes,
  fetchNewsOnly,
  fetchSeismicOnly
};