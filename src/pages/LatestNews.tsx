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
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Helper function to check if article is related to India
const isIndiaRelated = (article: NewsArticle): boolean => {
  const indianKeywords = [
    'india', 'indian', 'delhi', 'mumbai', 'bengaluru', 'chennai', 'kolkata',
    'hyderabad', 'ahmedabad', 'pune', 'jaipur', 'lucknow', 'kanpur', 'nagpur',
    'indore', 'thane', 'bhopal', 'visakhapatnam', 'patna', 'vadodara',
    'tamil nadu', 'kerala', 'karnataka', 'maharashtra', 'gujarat', 'rajasthan',
    'west bengal', 'andhra pradesh', 'telangana', 'uttar pradesh', 'madhya pradesh'
  ];
  
  const searchText = [
    article.title?.toLowerCase() || '',
    article.description?.toLowerCase() || '',
    article.content?.toLowerCase() || '',
    article.location?.region?.toLowerCase() || '',
    article.location?.country?.toLowerCase() || ''
  ].join(' ');

  return indianKeywords.some(keyword => searchText.includes(keyword));
};

// Process raw news data into categories
const processNewsData = (data: NewsArticle[]): NewsData => {
  const now = new Date().toISOString();
  
  return {
    all: [...data].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()),
    news: data.filter(article => article.type === 'news'),
    seismic: data.filter(article => article.type === 'seismic'),
    india: data.filter(isIndiaRelated),
    significant: data.filter(article => article.magnitude && article.magnitude >= 6.0),
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
      // Check cache first if not forcing refresh
      if (!force) {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < CACHE_DURATION) {
            setNewsData(processNewsData(data));
            setLoading(false);
            
            // Refresh in background
            if (Date.now() - timestamp > CACHE_DURATION / 2) {
              fetchNews(true);
            }
            return;
          }
        }
      }

      setLoading(true);
      const data = await fetchEarthquakeNews();
      const processedData = processNewsData(data);
      
      setNewsData(processedData);
      setError(null);
      
      // Update cache
      localStorage.setItem(CACHE_KEY, JSON.stringify({
        data,
        timestamp: Date.now()
      }));
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Failed to load news. Please try again later.');
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

  const renderTabContent = (articles: NewsArticle[]) => {
    if (loading) {
      return <NewsSkeleton />;
    }

    if (articles.length === 0) {
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

          <TabsContent value="all">
            {renderTabContent(newsData.all)}
          </TabsContent>

          <TabsContent value="news">
            {renderTabContent(newsData.news)}
          </TabsContent>

          <TabsContent value="seismic">
            {renderTabContent(newsData.seismic)}
          </TabsContent>

          <TabsContent value="india">
            {renderTabContent(newsData.india)}
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
