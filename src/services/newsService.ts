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

// Meticulous India detection with strict filtering
const isAboutIndia = (text: string): boolean => {
  if (!text) return false;
  
  const searchText = text.toLowerCase().trim();
  
  // STRICT EXCLUSION - Countries that are NOT India
  const excludeCountries = [
    'myanmar', 'burma', 'bangladesh', 'pakistan', 'nepal', 'china', 'sri lanka', 'bhutan',
    'afghanistan', 'tibet', 'maldives', 'thailand', 'indonesia', 'malaysia', 'philippines',
    'vietnam', 'cambodia', 'laos', 'singapore', 'brunei', 'japan', 'south korea', 'taiwan',
    'mongolia', 'kazakhstan', 'uzbekistan', 'kyrgyzstan', 'tajikistan', 'turkmenistan',
    'iran', 'iraq', 'turkey', 'syria', 'lebanon', 'jordan', 'israel', 'palestine',
    'saudi arabia', 'yemen', 'oman', 'uae', 'qatar', 'bahrain', 'kuwait'
  ];
  
  // STRICT EXCLUSION - Non-India terms
  const excludeTerms = [
    'indiana', 'indianapolis', 'american indian', 'native american', 'west indies', 'east indies',
    'indian restaurant', 'indian cuisine', 'indian food', 'indian culture', 'indian festival',
    'indian diaspora', 'indian community in', 'indians in america', 'indians in canada',
    'indians in uk', 'indian-american', 'indian american', 'indian origin', 'nri', 'pio',
    'overseas indian', 'indian ocean', 'indian subcontinent region', 'south asian region',
    'myanmar earthquake', 'bangladesh earthquake', 'pakistan earthquake', 'nepal earthquake',
    'china earthquake', 'sri lanka earthquake', 'bhutan earthquake', 'afghanistan earthquake'
  ];
  
  // If any exclusion term is found, it's definitely NOT about India
  if (excludeCountries.some(country => searchText.includes(country)) || 
      excludeTerms.some(term => searchText.includes(term))) {
    return false;
  }
  
  // PRECISE INDIA KEYWORDS - Only specific Indian locations
  const indiaSpecificKeywords = [
    // Major Indian cities (must be exact matches)
    'new delhi', 'delhi', 'mumbai', 'bangalore', 'bengaluru', 'chennai', 'kolkata', 'calcutta',
    'hyderabad', 'pune', 'ahmedabad', 'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore',
    'bhopal', 'visakhapatnam', 'vizag', 'patna', 'vadodara', 'ghaziabad', 'ludhiana',
    'agra', 'nashik', 'faridabad', 'meerut', 'rajkot', 'kalyan', 'vasai', 'vijayawada',
    'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh', 'guwahati', 'solapur',
    'hubli', 'mysore', 'gurgaon', 'gurugram', 'noida', 'greater noida',
    
    // Indian states (must be exact matches)
    'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra',
    'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'bihar', 'west bengal',
    'odisha', 'orissa', 'assam', 'punjab', 'haryana', 'himachal pradesh', 'uttarakhand',
    'jharkhand', 'chhattisgarh', 'goa', 'manipur', 'meghalaya', 'tripura', 'nagaland',
    'arunachal pradesh', 'mizoram', 'sikkim', 'jammu and kashmir', 'ladakh',
    
    // Specific earthquake-related terms for India
    'earthquake in india', 'india earthquake', 'indian earthquake', 'earthquake hits india',
    'earthquake strikes india', 'tremors in india', 'seismic activity in india',
    'earthquake felt in india', 'india seismic', 'indian seismic activity'
  ];
  
  // Check for specific India keywords
  const hasIndiaKeyword = indiaSpecificKeywords.some(keyword => searchText.includes(keyword));
  
  if (hasIndiaKeyword) {
    return true;
  }
  
  // Final check for general "India" term with earthquake context
  if (searchText.includes('india') && !searchText.includes('indian ocean')) {
    // Must also have earthquake context
    const earthquakeTerms = ['earthquake', 'quake', 'tremor', 'seismic', 'magnitude', 'richter'];
    return earthquakeTerms.some(term => searchText.includes(term));
  }
  
  return false;
};

// Helper function to check if location is in India
const isLocationInIndia = (place: string): boolean => {
  return isAboutIndia(place);
};

// Fetch earthquake data from USGS (seismic data) - Limited and filtered
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
      .filter((quake: any) => {
        const mag = quake.properties.mag;
        const place = quake.properties.place || '';
        
        // Filter for significant earthquakes (3.0+) and exclude very small ones
        if (mag < 3.0) return false;
        
        // Prioritize higher magnitude earthquakes
        if (mag >= 5.0) return true;
        
        // For smaller earthquakes, be more selective
        return Math.random() < 0.7; // Include 70% of 3.0-4.9 earthquakes
      })
      .sort((a: any, b: any) => b.properties.mag - a.properties.mag) // Sort by magnitude
      .slice(0, 25) // Limit to 25 most significant
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

// Fetch news from GNews API with quality filtering
const fetchGNewsEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const apiKey = '0f2829470d1cca9155f182ffab0cb3b2'; // Your existing GNews API key
    const response = await fetch(
      `https://gnews.io/api/v4/search?q=earthquake&lang=en&max=25&apikey=${apiKey}`
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
      .filter((article: any) => {
        if (!article.title || !article.description) return false;
        
        const fullText = `${article.title} ${article.description} ${article.content || ''}`.toLowerCase();
        
        // Must contain earthquake-related terms
        const hasEarthquakeContent = fullText.includes('earthquake') || 
                                   fullText.includes('quake') || 
                                   fullText.includes('seismic') ||
                                   fullText.includes('tremor');
        
        if (!hasEarthquakeContent) return false;
        
        // HEAVILY exclude Myanmar content unless it's major news
        if (fullText.includes('myanmar') || fullText.includes('burma')) {
          // Only include if it's a major earthquake (magnitude 6.0+)
          const hasMajorMagnitude = /magnitude\s*[6-9]|m\s*[6-9]|[6-9]\.\d+\s*magnitude/i.test(fullText);
          return hasMajorMagnitude && Math.random() < 0.2; // Only 20% chance even for major Myanmar earthquakes
        }
        
        // Exclude other non-relevant content
        const excludePatterns = [
          'earthquake drill', 'earthquake simulation', 'earthquake movie', 'earthquake game',
          'earthquake insurance', 'earthquake stocks', 'earthquake bonds'
        ];
        
        return !excludePatterns.some(pattern => fullText.includes(pattern));
      })
      .slice(0, 12) // Reduced limit
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

// Fetch news from NewsAPI.org with enhanced filtering
const fetchNewsAPIEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const apiKey = 'd4b87e3551324d55b23a8b04822bd917'; // Your existing NewsAPI key
    const response = await fetch(
      `https://newsapi.org/v2/everything?q=earthquake&language=en&sortBy=publishedAt&pageSize=25&apiKey=${apiKey}`
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
      .filter((article: any) => {
        if (!article.title || !article.description || article.title.includes('[Removed]')) {
          return false;
        }
        
        const fullText = `${article.title} ${article.description} ${article.content || ''}`.toLowerCase();
        
        // Must contain earthquake-related terms
        const hasEarthquakeContent = fullText.includes('earthquake') || 
                                   fullText.includes('quake') || 
                                   fullText.includes('seismic') ||
                                   fullText.includes('tremor');
        
        if (!hasEarthquakeContent) return false;
        
        // HEAVILY reduce Myanmar content - only magnitude 6.0+ earthquakes
        if (fullText.includes('myanmar') || fullText.includes('burma')) {
          const hasMajorMagnitude = /magnitude\s*[6-9]|m\s*[6-9]|[6-9]\.\d+\s*magnitude/i.test(fullText);
          return hasMajorMagnitude && Math.random() < 0.3; // Only 30% chance even for major Myanmar earthquakes
        }
        
        // Prioritize diverse geographical coverage
        const priorityRegions = ['japan', 'california', 'turkey', 'chile', 'indonesia', 'italy', 'greece', 'iran', 'india'];
        const hasPriorityRegion = priorityRegions.some(region => fullText.includes(region));
        
        // Include all priority region articles, and 60% of others
        return hasPriorityRegion || Math.random() < 0.6;
      })
      .slice(0, 12) // Reduced limit
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

// Fetch news from The Guardian API with quality filtering
const fetchGuardianEarthquakes = async (): Promise<NewsArticle[]> => {
  try {
    const response = await fetch(
      'https://content.guardianapis.com/search?q=earthquake&section=world&show-fields=thumbnail,bodyText&page-size=20&api-key=test'
    );
    
    if (!response.ok) {
      throw new Error(`Guardian API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.response?.results || [])
      .filter((article: any) => {
        if (!article.webTitle || !article.webUrl) return false;
        
        const fullText = `${article.webTitle} ${article.fields?.bodyText || ''}`.toLowerCase();
        
        // HEAVILY limit Myanmar content
        if (fullText.includes('myanmar') || fullText.includes('burma')) {
          const hasMajorMagnitude = /magnitude\s*[6-9]|m\s*[6-9]|[6-9]\.\d+\s*magnitude/i.test(fullText);
          return hasMajorMagnitude && Math.random() < 0.2; // Only 20% chance even for major Myanmar earthquakes
        }
        
        return true;
      })
      .slice(0, 8) // Reduced limit
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

// Fetch from CurrentsAPI with enhanced filtering for diverse content
const fetchCurrentsAPINews = async (): Promise<NewsArticle[]> => {
  try {
    const apiKey = 'qVWbmf0_0vrdrjVZ5BNc5MqMf4lwI0GVeSSl3VRMaZjeNwum';
    const response = await fetch(
      `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&language=en&keywords=earthquake`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('CurrentsAPI rate limit reached');
        return [];
      }
      throw new Error(`CurrentsAPI error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.news || [])
      .filter((article: any) => {
        if (!article.title || !article.description) return false;
        
        const fullText = `${article.title} ${article.description}`.toLowerCase();
        
        // Must contain earthquake-related terms
        const hasEarthquakeContent = fullText.includes('earthquake') || 
                                   fullText.includes('quake') || 
                                   fullText.includes('seismic') ||
                                   fullText.includes('tremor');
        
        if (!hasEarthquakeContent) return false;
        
        // PRIORITIZE NON-MYANMAR CONTENT
        // Heavily limit Myanmar content - only magnitude 6.0+ earthquakes
        if (fullText.includes('myanmar') || fullText.includes('burma')) {
          const hasMajorMagnitude = /magnitude\s*[6-9]|m\s*[6-9]|[6-9]\.\d+\s*magnitude/i.test(fullText);
          return hasMajorMagnitude && Math.random() < 0.2; // Only 20% chance even for major Myanmar earthquakes
        }
        
        // PRIORITIZE DIVERSE COUNTRIES
        const priorityCountries = [
          'japan', 'california', 'turkey', 'chile', 'indonesia', 'italy', 'greece', 
          'iran', 'india', 'mexico', 'peru', 'ecuador', 'philippines', 'taiwan',
          'new zealand', 'alaska', 'hawaii', 'nevada', 'oklahoma', 'arkansas'
        ];
        
        const hasPriorityCountry = priorityCountries.some(country => fullText.includes(country));
        
        // Include all priority country articles, and only 30% of others
        return hasPriorityCountry || Math.random() < 0.3;
      })
      .slice(0, 15) // Limit to 15 articles
      .map((article: any) => {
        const fullText = `${article.title} ${article.description}`;
        const isIndia = isAboutIndia(fullText);
        
        return {
          id: article.url || `currents-${Date.now()}-${Math.random()}`,
          title: article.title,
          description: article.description || 'No description available',
          content: article.description || 'No content available',
          url: article.url,
          image: article.image || '/placeholder.svg',
          publishedAt: article.published || new Date().toISOString(),
          source: {
            name: 'CurrentsAPI',
            url: 'https://currentsapi.services'
          },
          location: {
            country: isIndia ? 'India' : 'Global',
            region: isIndia ? 'India' : 'Global'
          },
          type: 'news' as const
        };
      });
  } catch (error) {
    console.error('Error fetching CurrentsAPI news:', error);
    return [];
  }
};

// Fetch from CurrentsAPI India-specific with strict filtering
const fetchCurrentsAPIIndiaNews = async (): Promise<NewsArticle[]> => {
  try {
    const apiKey = 'qVWbmf0_0vrdrjVZ5BNc5MqMf4lwI0GVeSSl3VRMaZjeNwum';
    const response = await fetch(
      `https://api.currentsapi.services/v1/search?apiKey=${apiKey}&language=en&country=IN&keywords=earthquake`
    );
    
    if (!response.ok) {
      if (response.status === 429) {
        console.warn('CurrentsAPI India rate limit reached');
        return [];
      }
      throw new Error(`CurrentsAPI India error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return (data.news || [])
      .filter((article: any) => {
        if (!article.title || !article.description) return false;
        
        const fullText = `${article.title} ${article.description}`.toLowerCase();
        
        // Must contain earthquake-related terms
        const hasEarthquakeContent = fullText.includes('earthquake') || 
                                   fullText.includes('quake') || 
                                   fullText.includes('seismic') ||
                                   fullText.includes('tremor');
        
        if (!hasEarthquakeContent) return false;
        
        // STRICT: Must be about India (not Myanmar/Bangladesh/Pakistan)
        return isAboutIndia(fullText);
      })
      .slice(0, 8) // Limit to 8 India-specific articles
      .map((article: any) => {
        return {
          id: article.url || `currents-india-${Date.now()}-${Math.random()}`,
          title: article.title,
          description: article.description || 'No description available',
          content: article.description || 'No content available',
          url: article.url,
          image: article.image || '/placeholder.svg',
          publishedAt: article.published || new Date().toISOString(),
          source: {
            name: 'CurrentsAPI India',
            url: 'https://currentsapi.services'
          },
          location: {
            country: 'India',
            region: 'India'
          },
          type: 'news' as const
        };
      });
  } catch (error) {
    console.error('Error fetching CurrentsAPI India news:', error);
    return [];
  }
};

// Fetch RSS news with CORS proxy and enhanced filtering
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
      .filter((item: any) => {
        if (!item.title || !item.description) return false;
        
        const fullText = `${item.title} ${item.description}`.toLowerCase();
        
        // Must contain earthquake-related terms
        const hasEarthquakeContent = fullText.includes('earthquake') || 
                                   fullText.includes('quake') || 
                                   fullText.includes('seismic') ||
                                   fullText.includes('tremor');
        
        if (!hasEarthquakeContent) return false;
        
        // HEAVILY limit Myanmar content to major earthquakes only
        if (fullText.includes('myanmar') || fullText.includes('burma')) {
          const hasMajorMagnitude = /magnitude\s*[6-9]|m\s*[6-9]|[6-9]\.\d+\s*magnitude/i.test(fullText);
          return hasMajorMagnitude && Math.random() < 0.15; // Only 15% chance even for major Myanmar earthquakes
        }
        
        return true;
      })
      .slice(0, 8) // Reduced limit for RSS
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

// Enhanced content balancing with geographical diversity
const balanceContent = (articles: NewsArticle[]): NewsArticle[] => {
  // Separate seismic data and news articles
  const seismicArticles = articles.filter(article => article.type === 'seismic');
  const newsArticles = articles.filter(article => article.type === 'news');
  
  // GEOGRAPHICAL DIVERSITY FOR NEWS ARTICLES
  const diversifyNews = (news: NewsArticle[]): NewsArticle[] => {
    const countryCount: { [key: string]: number } = {};
    const diverseNews: NewsArticle[] = [];
    
    // Sort by date first
    const sortedNews = news.sort((a, b) => 
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
    
    // Add articles with geographical diversity priority
    for (const article of sortedNews) {
      const content = `${article.title} ${article.description}`.toLowerCase();
      
      // Identify country/region
      let region = 'other';
      const regions = [
        { key: 'myanmar', terms: ['myanmar', 'burma'] },
        { key: 'japan', terms: ['japan', 'japanese'] },
        { key: 'california', terms: ['california', 'los angeles', 'san francisco'] },
        { key: 'turkey', terms: ['turkey', 'turkish', 'istanbul', 'ankara'] },
        { key: 'chile', terms: ['chile', 'chilean', 'santiago'] },
        { key: 'indonesia', terms: ['indonesia', 'indonesian', 'jakarta'] },
        { key: 'italy', terms: ['italy', 'italian', 'rome'] },
        { key: 'greece', terms: ['greece', 'greek', 'athens'] },
        { key: 'iran', terms: ['iran', 'iranian', 'tehran'] },
        { key: 'india', terms: ['india', 'indian', 'delhi', 'mumbai'] },
        { key: 'mexico', terms: ['mexico', 'mexican'] },
        { key: 'philippines', terms: ['philippines', 'filipino', 'manila'] },
        { key: 'taiwan', terms: ['taiwan', 'taiwanese'] },
        { key: 'new_zealand', terms: ['new zealand', 'zealand'] },
        { key: 'alaska', terms: ['alaska', 'alaskan'] }
      ];
      
      for (const r of regions) {
        if (r.terms.some(term => content.includes(term))) {
          region = r.key;
          break;
        }
      }
      
      // Limit Myanmar to max 2 articles, others to max 3
      const maxForRegion = region === 'myanmar' ? 2 : 3;
      
      if ((countryCount[region] || 0) < maxForRegion) {
        diverseNews.push(article);
        countryCount[region] = (countryCount[region] || 0) + 1;
        
        if (diverseNews.length >= 15) break; // Max 15 news articles
      }
    }
    
    console.log('📍 Geographical distribution:', countryCount);
    return diverseNews;
  };
  
  // Apply geographical diversity to news
  const diverseNews = diversifyNews(newsArticles);
  
  // Sort seismic by magnitude (prioritize higher magnitude)
  const sortedSeismic = seismicArticles
    .sort((a, b) => (b.magnitude || 0) - (a.magnitude || 0))
    .slice(0, 18); // Take top 18 seismic events
  
  // Take remaining slots for news (30 total - seismic count)
  const remainingSlots = 30 - sortedSeismic.length;
  const selectedNews = diverseNews.slice(0, Math.max(remainingSlots, 10));
  
  // Combine and sort by date
  const combined = [...sortedSeismic, ...selectedNews].sort((a, b) => 
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  console.log(`📊 Content balance: ${sortedSeismic.length} seismic + ${selectedNews.length} news = ${combined.length} total`);
  
  return combined.slice(0, 30); // Ensure exactly 30 articles
};

// Main function to fetch earthquake news from multiple sources
export const fetchEarthquakeNews = async (): Promise<NewsArticle[]> => {
  const allArticles: NewsArticle[] = [];
  
  try {
    console.log('🔄 Fetching earthquake news from multiple sources...');
    
    // Fetch from all sources concurrently with timeout
    const sources = [
      { name: 'USGS', fetch: fetchUSGSEarthquakes },
      { name: 'CurrentsAPI', fetch: fetchCurrentsAPINews },
      { name: 'CurrentsAPI India', fetch: fetchCurrentsAPIIndiaNews },
      { name: 'GNews', fetch: fetchGNewsEarthquakes },
      { name: 'NewsAPI', fetch: fetchNewsAPIEarthquakes },
      { name: 'Guardian', fetch: fetchGuardianEarthquakes },
      { name: 'Reuters RSS', fetch: () => fetchRSSNews('https://feeds.reuters.com/Reuters/worldNews', 'Reuters') },
      { name: 'BBC RSS', fetch: () => fetchRSSNews('http://feeds.bbci.co.uk/news/world/rss.xml', 'BBC News') },
      { name: 'CNN RSS', fetch: () => fetchRSSNews('http://rss.cnn.com/rss/edition.rss', 'CNN') },
      { name: 'AP News RSS', fetch: () => fetchRSSNews('https://feeds.apnews.com/rss/apf-topnews', 'Associated Press') }
    ];
    
    // Fetch with timeout to prevent hanging
    const results = await Promise.allSettled(
      sources.map(async (source) => {
        const timeout = new Promise<NewsArticle[]>((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 8000) // Reduced timeout
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
    
    // Remove duplicates first
    const uniqueArticles = processArticles(allArticles);
    
    // Apply content balancing
    const balancedArticles = balanceContent(uniqueArticles);
    
    if (balancedArticles.length > 0) {
      console.log(`✅ Final balanced content: ${balancedArticles.length} articles`);
      return balancedArticles;
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