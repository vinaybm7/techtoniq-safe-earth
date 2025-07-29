// Simple, reliable news service for earthquake data
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

// Helper function to check if location is in India
const isLocationInIndia = (place: string): boolean => {
  if (!place) return false;
  
  const searchText = place.toLowerCase();
  
  // Indian locations and terms
  const indiaKeywords = [
    'india', 'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad',
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore',
    'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 
    'maharashtra', 'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh',
    'bihar', 'west bengal', 'odisha', 'assam', 'punjab', 'haryana',
    'himachal pradesh', 'uttarakhand', 'jharkhand', 'chhattisgarh'
  ];
  
  return indiaKeywords.some(keyword => searchText.includes(keyword));
};

// Fetch earthquake data from USGS (most reliable source)
const fetchUSGSEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson'
    );
    
    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.features
      .filter((quake: any) => quake.properties.mag >= 2.5) // Filter for significant earthquakes
      .slice(0, 50) // Limit to 50 most recent
      .map((quake: any) => {
        const place = quake.properties.place || 'Unknown location';
        const isIndia = isLocationInIndia(place);
        
        return {
          id: quake.id,
          title: quake.properties.title || `M${quake.properties.mag} - ${place}`,
          description: `A magnitude ${quake.properties.mag} earthquake occurred ${place}. ${isIndia ? 'This event occurred in India.' : ''}`,
          content: `Earthquake Details:\n• Magnitude: ${quake.properties.mag}\n• Location: ${place}\n• Depth: ${quake.geometry.coordinates[2] || 'Unknown'} km\n• Time: ${new Date(quake.properties.time).toLocaleString()}`,
          url: quake.properties.url,
          image: '/placeholder.svg',
          publishedAt: new Date(quake.properties.time).toISOString(),
          source: {
            name: 'USGS Earthquake Hazards Program',
            url: 'https://earthquake.usgs.gov'
          },
          location: {
            country: isIndia ? 'India' : 'Global',
            region: place,
            coordinates: [quake.geometry.coordinates[0], quake.geometry.coordinates[1]]
          },
          magnitude: quake.properties.mag,
          depth: quake.geometry.coordinates[2],
          type: 'seismic' as const
        };
      });
  } catch (error) {
    console.error('Error fetching USGS earthquakes:', error);
    return [];
  }
};

// Fallback news data when APIs fail
const getFallbackNews = (): NewsArticle[] => [
  {
    id: 'fallback-1',
    title: 'Global Earthquake Monitoring Systems Active',
    description: 'Seismic monitoring networks worldwide continue to track earthquake activity 24/7.',
    content: 'The global network of seismic monitoring stations operates continuously to detect and analyze earthquake activity. These systems help scientists understand seismic patterns and provide early warnings when possible.',
    url: 'https://earthquake.usgs.gov',
    image: '/placeholder.svg',
    publishedAt: new Date().toISOString(),
    source: {
      name: 'USGS Earthquake Hazards Program',
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
    title: 'Earthquake Preparedness: Stay Ready',
    description: 'Learn about earthquake preparedness and safety measures to protect yourself and your family.',
    content: 'Earthquake preparedness involves creating emergency plans, securing heavy objects, and knowing what to do during and after an earthquake. Regular drills and emergency kits can save lives.',
    url: 'https://www.ready.gov/earthquakes',
    image: '/placeholder.svg',
    publishedAt: new Date().toISOString(),
    source: {
      name: 'Ready.gov',
      url: 'https://www.ready.gov'
    },
    location: {
      country: 'Global',
      region: 'Safety Information'
    },
    type: 'news'
  },
  {
    id: 'fallback-3',
    title: 'India Seismic Monitoring Network',
    description: 'India maintains a comprehensive network of seismic monitoring stations across the country.',
    content: 'The India Meteorological Department operates seismic monitoring stations throughout India to track earthquake activity and provide timely information to the public and emergency services.',
    url: 'https://mausam.imd.gov.in',
    image: '/placeholder.svg',
    publishedAt: new Date().toISOString(),
    source: {
      name: 'India Meteorological Department',
      url: 'https://mausam.imd.gov.in'
    },
    location: {
      country: 'India',
      region: 'India'
    },
    type: 'news'
  }
];

// Main function to fetch earthquake news
export const fetchEarthquakeNews = async (): Promise<NewsArticle[]> => {
  try {
    console.log('Fetching earthquake news from USGS...');
    
    // Try to fetch from USGS
    const usgsData = await fetchUSGSEarthquakes();
    
    if (usgsData.length > 0) {
      console.log(`✅ Successfully fetched ${usgsData.length} earthquake records from USGS`);
      return usgsData;
    }
    
    // If no USGS data, return fallback
    console.log('⚠️ No USGS data available, using fallback news');
    return getFallbackNews();
    
  } catch (error) {
    console.error('❌ Error fetching earthquake news:', error);
    return getFallbackNews();
  }
};

// Fetch India-specific earthquake news
export const fetchIndiaEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const allNews = await fetchEarthquakeNews();
    const indiaNews = allNews.filter(article => 
      article.location?.country === 'India' || 
      isLocationInIndia(article.location?.region || '')
    );
    
    // If no India-specific earthquakes, return India fallback
    if (indiaNews.length === 0) {
      return getFallbackNews().filter(item => item.location?.country === 'India');
    }
    
    return indiaNews;
  } catch (error) {
    console.error('Error fetching India earthquakes:', error);
    return getFallbackNews().filter(item => item.location?.country === 'India');
  }
};

// Fetch only news articles (non-seismic)
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