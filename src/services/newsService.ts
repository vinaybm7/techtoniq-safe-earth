// Enhanced news service with multiple reliable sources
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

// Helper function to check if content is about India
const isAboutIndia = (text: string): boolean => {
  if (!text) return false;
  
  const searchText = text.toLowerCase();
  
  // Strong exclusion terms
  const excludeTerms = [
    'indiana', 'indianapolis', 'american indian', 'native american', 'west indies',
    'indian restaurant', 'indian cuisine', 'indian food', 'indian culture',
    'indian diaspora', 'indian community in', 'indians in america', 'indians in canada',
    'indian-american', 'indian american', 'indian origin', 'nri', 'pio'
  ];
  
  if (excludeTerms.some(term => searchText.includes(term))) {
    return false;
  }
  
  // Indian locations and terms
  const indiaKeywords = [
    'india', 'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'hyderabad',
    'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'bhopal',
    'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 
    'maharashtra', 'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh',
    'bihar', 'west bengal', 'odisha', 'assam', 'punjab', 'haryana',
    'himachal pradesh', 'uttarakhand', 'jharkhand', 'chhattisgarh', 'goa',
    'jammu and kashmir', 'ladakh', 'northeast india', 'north india', 'south india'
  ];
  
  return indiaKeywords.some(keyword => searchText.includes(keyword));
};

// Helper function to check if location is in India
const isLocationInIndia = (place: string): boolean => {
  return isAboutIndia(place);
};

// Fetch earthquake data from USGS (seismic data)
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
      .filter((quake: any) => quake.properties.mag >= 3.0) // Filter for significant earthquakes
      .slice(0, 30) // Limit to 30 most recent
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

// Fetch news from GNews API
const fetchGNewsEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const apiKey = '0f2829470d1cca9155f182ffab0cb3b2'; // Your existing GNews API key
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=earthquake&lang=en&max=20&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('GNews API rate limit reached');
        return [];
      }
      throw new Error(`GNews API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.articles || [])
      .filter((article: any) => 
        article.title && 
        article.description &&
        (article.title.toLowerCase().includes('earthquake') || 
         article.description.toLowerCase().includes('earthquake'))
      )
      .slice(0, 15)
      .map((article: any) => {
        const fullText = `${article.title} ${article.description} ${article.content || ''}`;
        const isIndia = isAboutIndia(fullText);
        
        return {
          id: article.url || `gnews-${Date.now()}-${Math.random()}`,
          title: article.title,
          description: article.description || 'No description available',
          content: article.content || article.description || 'No content available',
          url: article.url,
          image: article.image || '/placeholder.svg',
          publishedAt: article.publishedAt,
          source: {
            name: article.source?.name || 'GNews',
            url: article.source?.url || 'https://gnews.io'
          },
          location: {
            country: isIndia ? 'India' : 'Global',
            region: isIndia ? 'India' : 'Global'
          },
          type: 'news' as const
        };
      });
  } catch (error) {
    console.error('Error fetching GNews:', error);
    return [];
  }
};

// Fetch news from NewsAPI.org
const fetchNewsAPIEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const apiKey = 'd4b87e3551324d55b23a8b04822bd917'; // Your existing NewsAPI key
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=earthquake&language=en&sortBy=publishedAt&pageSize=20&apiKey=${apiKey}`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('NewsAPI rate limit reached');
        return [];
      }
      throw new Error(`NewsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.articles || [])
      .filter((article: any) => 
        article.title && 
        article.description &&
        !article.title.includes('[Removed]') &&
        (article.title.toLowerCase().includes('earthquake') || 
         article.description.toLowerCase().includes('earthquake'))
      )
      .slice(0, 15)
      .map((article: any) => {
        const fullText = `${article.title} ${article.description} ${article.content || ''}`;
        const isIndia = isAboutIndia(fullText);
        
        return {
          id: article.url || `newsapi-${Date.now()}-${Math.random()}`,
          title: article.title,
          description: article.description || 'No description available',
          content: article.content || article.description || 'No content available',
          url: article.url,
          image: article.urlToImage || '/placeholder.svg',
          publishedAt: article.publishedAt,
          source: {
            name: article.source?.name || 'NewsAPI',
            url: 'https://newsapi.org'
          },
          location: {
            country: isIndia ? 'India' : 'Global',
            region: isIndia ? 'India' : 'Global'
          },
          type: 'news' as const
        };
      });
  } catch (error) {
    console.error('Error fetching NewsAPI:', error);
    return [];
  }
};

// Fetch news from The Guardian API (free tier)
const fetchGuardianEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://content.guardianapis.com/search?q=earthquake&section=world&show-fields=thumbnail,bodyText&page-size=15&api-key=test'
    );
    
    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.response?.results || [])
      .filter((article: any) => article.webTitle && article.webUrl)
      .slice(0, 10)
      .map((article: any) => {
        const fullText = `${article.webTitle} ${article.fields?.bodyText || ''}`;
        const isIndia = isAboutIndia(fullText);
        
        return {
          id: article.id || `guardian-${Date.now()}-${Math.random()}`,
          title: article.webTitle,
          description: article.fields?.bodyText?.substring(0, 200) + '...' || 'No description available',
          content: article.fields?.bodyText || 'No content available',
          url: article.webUrl,
          image: article.fields?.thumbnail || '/placeholder.svg',
          publishedAt: article.webPublicationDate,
          source: {
            name: 'The Guardian',
            url: 'https://www.theguardian.com'
          },
          location: {
            country: isIndia ? 'India' : 'Global',
            region: isIndia ? 'India' : 'Global'
          },
          type: 'news' as const
        };
      });
  } catch (error) {
    console.error('Error fetching Guardian news:', error);
    return [];
  }
};

// Fetch RSS news with CORS proxy
const fetchRSSNews = async (rssUrl: string, sourceName: string): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`
    );
    
    if (!response.ok) {
      throw new Error(`RSS API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.items || [])
      .filter((item: any) => 
        item.title && 
        item.description &&
        (item.title.toLowerCase().includes('earthquake') || 
         item.description.toLowerCase().includes('earthquake'))
      )
      .slice(0, 10)
      .map((item: any) => {
        const fullText = `${item.title} ${item.description}`;
        const isIndia = isAboutIndia(fullText);
        
        return {
          id: item.link || `rss-${sourceName}-${Date.now()}-${Math.random()}`,
          title: item.title,
          description: item.description || 'No description available',
          content: item.content || item.description || 'No content available',
          url: item.link,
          image: item.thumbnail || '/placeholder.svg',
          publishedAt: item.pubDate,
          source: {
            name: sourceName,
            url: item.link
          },
          location: {
            country: isIndia ? 'India' : 'Global',
            region: isIndia ? 'India' : 'Global'
          },
          type: 'news' as const
        };
      });
  } catch (error) {
    console.error(`Error fetching RSS from ${sourceName}:`, error);
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

// Helper function to remove duplicates and sort articles
const processArticles = (articles: NewsArticle[]): NewsArticle[] => {
  // Remove duplicates based on title similarity
  const uniqueArticles = articles.filter((article, index, self) => {
    return index === self.findIndex(a => 
      a.title.toLowerCase().trim() === article.title.toLowerCase().trim() ||
      a.url === article.url
    );
  });
  
  // Sort by date (newest first)
  return uniqueArticles.sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
};

// Main function to fetch earthquake news from multiple sources
export const fetchEarthquakeNews = async (): Promise<NewsArticle[]> => {
  const allArticles: NewsArticle[] = [];
  
  try {
    console.log('🔄 Fetching earthquake news from multiple sources...');
    
    // Fetch from all sources concurrently with timeout
    const sources = [
      { name: 'USGS', fetch: fetchUSGSEarthquakes },
      { name: 'GNews', fetch: fetchGNewsEarthquakes },
      { name: 'NewsAPI', fetch: fetchNewsAPIEarthquakes },
      { name: 'Guardian', fetch: fetchGuardianEarthquakes },
      { name: 'Reuters RSS', fetch: () => fetchRSSNews('https://feeds.reuters.com/Reuters/worldNews', 'Reuters') },
      { name: 'BBC RSS', fetch: () => fetchRSSNews('http://feeds.bbci.co.uk/news/world/rss.xml', 'BBC News') }
    ];
    
    // Fetch with timeout to prevent hanging
    const results = await Promise.allSettled(
      sources.map(async (source) => {
        const timeout = new Promise<NewsArticle[]>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        );
        
        try {
          const result = await Promise.race([source.fetch(), timeout]);
          console.log(`✅ ${source.name}: ${result.length} articles`);
          return result;
        } catch (error) {
          console.warn(`⚠️ ${source.name} failed:`, error.message);
          return [];
        }
      })
    );
    
    // Collect all successful results
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        allArticles.push(...result.value);
      }
    });
    
    // Process and return articles
    const processedArticles = processArticles(allArticles);
    
    if (processedArticles.length > 0) {
      console.log(`✅ Total articles collected: ${processedArticles.length}`);
      return processedArticles.slice(0, 50); // Limit to 50 most recent
    }
    
    // If no articles, return fallback
    console.log('⚠️ No articles from any source, using fallback');
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
      isAboutIndia(article.title + ' ' + article.description)
    );
    
    console.log(`🇮🇳 India-specific articles: ${indiaNews.length}`);
    
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
  const newsArticles = allNews.filter(article => article.type === 'news');
  console.log(`📰 News articles: ${newsArticles.length}`);
  return newsArticles;
};

// Fetch only seismic data
export const fetchSeismicOnly = async (): Promise<NewsArticle[]> => {
  const allNews = await fetchEarthquakeNews();
  const seismicData = allNews.filter(article => article.type === 'seismic');
  console.log(`⚡ Seismic data: ${seismicData.length}`);
  return seismicData;
};

export default {
  fetchEarthquakeNews,
  fetchIndiaEarthquakes,
  fetchNewsOnly,
  fetchSeismicOnly
};