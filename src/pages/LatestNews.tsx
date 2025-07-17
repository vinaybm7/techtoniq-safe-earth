import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, RefreshCw, Newspaper } from 'lucide-react';

import PageLayout from '@/components/PageLayout';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { NewsCard } from '@/components/news/NewsCard';
import { NewsSkeleton } from '@/components/news/NewsSkeleton';
import { fetchEarthquakeNews } from '@/services/newsService';
import type { NewsArticle } from '@/types/news';

interface NewsData {
  all: NewsArticle[];
  news: NewsArticle[];
  seismic: NewsArticle[];
  india: NewsArticle[];
  significant: NewsArticle[];
  lastUpdated: string;
}

const CACHE_KEY = 'earthquake_news_cache';
const CACHE_VERSION = 'v2'; // Increment this when changing the data structure
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if article is related to India
const isIndiaRelated = (article: NewsArticle): boolean => {
  // If the article has a location and it's explicitly set to India
  if (article.location?.country?.toLowerCase() === 'india') {
    return true;
  }

  // Check if the source is an Indian news outlet
  const indianSources = [
    'the hindu', 'times of india', 'hindustan times', 'the economic times',
    'indian express', 'the telegraph', 'deccan herald', 'the hindu business line',
    'mint', 'business standard', 'india today', 'ndtv', 'republic world',
    'wion', 'news18', 'indiatv', 'zee news', 'aaj tak', 'india today',
    'times now', 'news nation', 'the print', 'the wire', 'scroll', 'the quint',
    'newslaundry', 'news minute', 'the better india', 'the logical indian'
  ];

  const sourceName = article.source?.name?.toLowerCase() || '';
  if (indianSources.some(source => sourceName.includes(source))) {
    return true;
  }

  // Check content for India-related keywords
  const indiaKeywords = [
    // Major cities
    'delhi', 'new delhi', 'mumbai', 'bombay', 'bengaluru', 'bangalore', 'chennai', 'madras',
    'kolkata', 'calcutta', 'hyderabad', 'pune', 'ahmedabad', 'surat', 'jaipur', 'lucknow',
    'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam', 'vizag', 'patna',
    'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut', 'rajkot',
    'kalyan', 'vasai', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota', 'chandigarh',
    'guwahati', 'solapur', 'hubli', 'mysore', 'gurgaon', 'gurugram', 'noida', 'greater noida',
    
    // States and UTs
    'andhra pradesh', 'arunachal pradesh', 'assam', 'bihar', 'chhattisgarh', 'goa', 'gujarat',
    'haryana', 'himachal pradesh', 'jharkhand', 'karnataka', 'kerala', 'madhya pradesh',
    'maharashtra', 'manipur', 'meghalaya', 'mizoram', 'nagaland', 'odisha', 'punjab',
    'rajasthan', 'sikkim', 'tamil nadu', 'telangana', 'tripura', 'uttar pradesh', 'uttarakhand',
    'west bengal', 'andaman and nicobar', 'chandigarh', 'dadra and nagar haveli', 'daman and diu',
    'delhi', 'jammu and kashmir', 'ladakh', 'lakshadweep', 'puducherry',
    
    // Common terms
    'india', 'indian', 'bharat', 'hindustan', 'republic of india', 'indian government', 'pm modi',
    'narendra modi', 'indian army', 'indian navy', 'indian air force', 'indian railways',
    'reserve bank of india', 'rbi', 'supreme court of india', 'parliament of india', 'lok sabha',
    'rajya sabha', 'indian economy', 'indian rupee', 'indian stock market', 'sensex', 'nifty',
    'indian culture', 'indian cuisine', 'bollywood', 'tollywood', 'kollywood', 'indian cricket',
    'bcci', 'indian premier league', 'ipl', 'indian football', 'indian hockey', 'indian badminton',
    'indian tennis', 'indian olympics', 'commonwealth games', 'asian games', 'south asian',
    'indian ocean', 'bay of bengal', 'arabian sea', 'himalayas', 'western ghats', 'eastern ghats',
    'thar desert', 'sundarbans', 'kashmir', 'ladakh', 'northeast india', 'seven sisters'
  ];

  // Terms that explicitly indicate non-India content
  const excludeTerms = [
    'pakistan', 'china', 'nepal', 'bangladesh', 'sri lanka', 'bhutan', 'myanmar',
    'afghanistan', 'maldives', 'tibet', 'tibetan', 'kashmir issue', 'pak occupied kashmir',
    'pok', 'loc', 'line of control', 'india vs', 'vs india', 'indian origin', 'indian-american',
    'indian american', 'indian diaspora', 'nri', 'pio', 'indian community in', 'indians in',
    'indian restaurant', 'indian food', 'indian cuisine', 'indian culture', 'indian festival'
  ];
  
  const searchText = [
    article.title?.toLowerCase() || '',
    article.description?.toLowerCase() || '',
    article.content?.toLowerCase() || '',
    article.location?.region?.toLowerCase() || '',
    article.location?.country?.toLowerCase() || ''
  ].join(' ');

  // If any exclude terms are found, it's not about India
  if (excludeTerms.some(term => searchText.includes(term))) {
    return false;
  }

  // Check for India-related keywords
  return indiaKeywords.some(keyword => {
    // Use word boundaries to avoid partial matches (e.g., 'indian' in 'indiana')
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(searchText);
  });
};

// Process raw news data into categories
const processNewsData = (data: NewsArticle[]): NewsData => {
  const now = new Date().toISOString();
  
  // Filter out any invalid or error articles
  const validArticles = data.filter(article => 
    article && 
    article.title && 
    article.source?.name &&
    !article.title.includes('Error:') &&
    !article.title.includes('Failed to fetch')
  );
  
  // Sort all articles by date (newest first)
  const sortedArticles = [...validArticles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
  
  // Filter India-related articles with additional checks
  const indiaArticles = validArticles.filter(article => {
    try {
      return isIndiaRelated(article);
    } catch (error) {
      console.error('Error checking India related article:', error);
      return false;
    }
  });
  
  return {
    all: sortedArticles,
    news: validArticles.filter(article => article.type === 'news'),
    seismic: validArticles.filter(article => article.type === 'seismic'),
    india: indiaArticles,
    significant: validArticles.filter(article => article.magnitude && article.magnitude >= 6.0),
    lastUpdated: now
  };
};

const LatestNews = () => {
  const [newsData, setNewsData] = useState<NewsData>({
    all: [],
    news: [],
    seismic: [],
    india: [],
    significant: [],
    lastUpdated: new Date().toISOString()
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNews = useCallback(async (force = false) => {
    try {
      // Clear old cache if it exists from previous versions
      localStorage.removeItem('earthquake_news_cache');
      
      // Check cache first if not forcing refresh
      if (!force) {
        const cached = localStorage.getItem(`${CACHE_KEY}_${CACHE_VERSION}`);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const isCacheValid = Date.now() - timestamp < CACHE_DURATION;
          
          if (isCacheValid) {
            setNewsData(processNewsData(data));
            setLoading(false);
            
            // Refresh in background if cache is older than half its duration
            if (Date.now() - timestamp > CACHE_DURATION / 2) {
              fetchNews(true);
            }
            return;
          } else {
            // Clear expired cache
            localStorage.removeItem(`${CACHE_KEY}_${CACHE_VERSION}`);
          }
        }
      }

      setLoading(true);
      const data = await fetchEarthquakeNews();
      const processedData = processNewsData(data);
      
      setNewsData(processedData);
      setError(null);
      
      // Update cache with versioning
      const cacheData = {
        data,
        timestamp: Date.now(),
        version: CACHE_VERSION
      };
      localStorage.setItem(`${CACHE_KEY}_${CACHE_VERSION}`, JSON.stringify(cacheData));
      
      // Clear any old cache versions
      Object.keys(localStorage).forEach(key => {
        if (key.startsWith(CACHE_KEY) && key !== `${CACHE_KEY}_${CACHE_VERSION}`) {
          localStorage.removeItem(key);
        }
      });
    } catch (err) {
      console.error('Error fetching news:', err);
      // Clear cache on error to prevent serving stale data
      localStorage.removeItem(`${CACHE_KEY}_${CACHE_VERSION}`);
      
      // Set appropriate error message
      if (err.message?.includes('429')) {
        setError('Too many requests. Please wait a few minutes before refreshing.');
      } else if (err.message?.includes('network')) {
        setError('Network error. Please check your internet connection.');
      } else {
        setError('Failed to load news. Please try again later.');
      }
      
      // If we have cached data, use it even if it's stale
      const cached = localStorage.getItem(`${CACHE_KEY}_${CACHE_VERSION}`);
      if (cached) {
        try {
          const { data } = JSON.parse(cached);
          setNewsData(processNewsData(data));
        } catch (parseError) {
          console.error('Error parsing cached data:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleRefresh = () => {
    fetchNews(true);
  };

  const renderTabContent = (articles: NewsArticle[], tabName: string = '') => {
    if (loading) {
      return <NewsSkeleton />;
    }

    if (articles.length === 0) {
      // Special message for India tab when no articles are found
      if (tabName === 'india') {
        return (
          <div className="col-span-full text-center py-12 text-muted-foreground">
            <Newspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900">No India-specific earthquake news found</h3>
            <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
              We couldn't find any recent earthquake news specifically about India. This could be because:
            </p>
            <ul className="mt-2 text-sm text-gray-500 max-w-md mx-auto text-left list-disc list-inside">
              <li>There are no recent earthquakes in India</li>
              <li>News sources may not have reported on the earthquakes yet</li>
              <li>Try refreshing the page or check back later for updates</li>
            </ul>
          </div>
        );
      }
      
      // Default message for other tabs
      return (
        <div className="col-span-full text-center py-12 text-muted-foreground">
          <Newspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900">No articles found</h3>
          <p className="mt-1 text-sm text-gray-500">
            We couldn't find any articles matching your criteria.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    );
  };

  if (error) {
    return (
      <PageLayout>
        <div className="container py-12 text-center">
          <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
            <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading News</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={handleRefresh} variant="outline">
              <RefreshCw className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <div className="container py-8">
        <PageBreadcrumbs 
          items={[
            { label: 'Home', href: '/' },
            { label: 'News', href: '/news' },
            { label: 'Latest Updates' }
          ]} 
          className="mb-6"
        />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Latest Earthquake News</h1>
            <p className="text-muted-foreground">
              Stay updated with the latest seismic activity and news from around the world
            </p>
          </div>
          <Button 
            onClick={handleRefresh}
            disabled={loading}
            variant="outline"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh'}
          </Button>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All ({newsData.all.length})</TabsTrigger>
            <TabsTrigger value="news">News ({newsData.news.length})</TabsTrigger>
            <TabsTrigger value="seismic">Seismic ({newsData.seismic.length})</TabsTrigger>
            <TabsTrigger value="india">India ({newsData.india.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-0">
            {renderTabContent(newsData.all, 'all')}
          </TabsContent>
          <TabsContent value="news">
            {renderTabContent(newsData.news, 'news')}
          </TabsContent>
          <TabsContent value="seismic">
            {renderTabContent(newsData.seismic, 'seismic')}
          </TabsContent>
          <TabsContent value="india">
            {renderTabContent(newsData.india, 'india')}
          </TabsContent>
          <TabsContent value="significant">
            {renderTabContent(newsData.significant, 'significant')}
          </TabsContent>
        </Tabs>

        <div className="mt-12 pt-6 border-t">
          <p className="text-sm text-muted-foreground text-center">
            Last updated: {format(new Date(newsData.lastUpdated), "MMM d, yyyy 'at' h:mm a")}
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default LatestNews;
