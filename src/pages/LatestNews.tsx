import { useState, useEffect, useCallback } from 'react';
import { format } from 'date-fns';
import { AlertTriangle, RefreshCw, Newspaper, Zap, MapPin, Clock, ExternalLink, Globe, Activity } from 'lucide-react';

import PageLayout from '@/components/PageLayout';
import PageBreadcrumbs from '@/components/PageBreadcrumbs';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

import { fetchEarthquakeNews, fetchIndiaEarthquakes, fetchNewsOnly, fetchSeismicOnly } from '@/services/newsService';

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

const LatestNews = () => {
  const [allNews, setAllNews] = useState<NewsArticle[]>([]);
  const [indiaNews, setIndiaNews] = useState<NewsArticle[]>([]);
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([]);
  const [seismicData, setSeismicData] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const loadNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🔄 Loading earthquake news...');
      
      // Fetch all data concurrently
      const [all, india, news, seismic] = await Promise.all([
        fetchEarthquakeNews(),
        fetchIndiaEarthquakes(),
        fetchNewsOnly(),
        fetchSeismicOnly()
      ]);
      
      setAllNews(all);
      setIndiaNews(india);
      setNewsArticles(news);
      setSeismicData(seismic);
      setLastUpdated(new Date());
      
      console.log(`✅ Loaded: ${all.length} total, ${india.length} India, ${news.length} news, ${seismic.length} seismic`);
      
    } catch (err) {
      console.error('❌ Error loading news:', err);
      setError('Failed to load earthquake news. Please try refreshing.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);

  const handleRefresh = () => {
    loadNews();
  };

  const getMagnitudeColor = (magnitude?: number) => {
    if (!magnitude) return 'bg-gray-500';
    if (magnitude >= 7.0) return 'bg-red-500';
    if (magnitude >= 6.0) return 'bg-orange-500';
    if (magnitude >= 5.0) return 'bg-yellow-500';
    if (magnitude >= 4.0) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getTypeIcon = (type: string) => {
    return type === 'news' ? <Newspaper className="h-4 w-4" /> : <Zap className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'news' ? 'bg-blue-500' : 'bg-purple-500';
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return dateString;
    }
  };

  const renderNewsCard = (article: NewsArticle) => (
    <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-lg">
            {article.title}
          </CardTitle>
          <div className="flex gap-2 flex-shrink-0">
            {article.magnitude && (
              <Badge className={`${getMagnitudeColor(article.magnitude)} text-white font-bold`}>
                M{article.magnitude}
              </Badge>
            )}
            <Badge className={`${getTypeColor(article.type)} text-white`}>
              {getTypeIcon(article.type)}
              <span className="ml-1">{article.type === 'news' ? 'News' : 'Seismic'}</span>
            </Badge>
          </div>
        </div>
        <CardDescription className="flex items-center gap-2 text-sm">
          <Globe className="h-3 w-3" />
          {article.source?.name}
          <span>•</span>
          <Clock className="h-3 w-3" />
          {formatDate(article.publishedAt)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3">
        <div className="space-y-3">
          {article.location?.region && article.location.region !== 'Unknown location' && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-3 w-3 text-blue-500" />
              <span className="font-medium">{article.location.region}</span>
              {article.location.country === 'India' && (
                <Badge variant="outline" className="text-xs border-blue-500 text-blue-500">
                  🇮🇳 India
                </Badge>
              )}
            </div>
          )}
          
          {article.depth && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Activity className="h-3 w-3 text-teal-500" />
              <span>Depth: {article.depth} km</span>
            </div>
          )}
          
          <p className="text-sm text-gray-700 line-clamp-3">
            {article.description}
          </p>
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm" className="w-full">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            {article.type === 'news' ? 'Read Article' : 'View Details'}
            <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );

  const renderSkeletonCards = () => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-[400px]">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2">
              <Skeleton className="h-6 w-3/4" />
              <div className="flex gap-2">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="flex-grow pb-3">
            <div className="space-y-3">
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-16 w-full" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <Skeleton className="h-10 w-full" />
          </CardFooter>
        </Card>
      ))}
    </div>
  );

  const renderTabContent = (articles: NewsArticle[], emptyMessage: string) => {
    if (loading) {
      return renderSkeletonCards();
    }

    if (articles.length === 0) {
      return (
        <div className="col-span-full text-center py-12">
          <Newspaper className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">{emptyMessage}</h3>
          <p className="text-sm text-gray-500">
            Try refreshing the page or check back later for updates.
          </p>
        </div>
      );
    }

    return (
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {articles.map(renderNewsCard)}
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
            { label: 'Latest News' }
          ]} 
          className="mb-6"
        />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Latest Earthquake News</h1>
            <p className="text-gray-600 mt-2">
              Real-time earthquake data and news from around the world
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-sm text-gray-500">
              Last updated: {format(lastUpdated, "MMM d, yyyy 'at' h:mm a")}
            </div>
            <Button 
              onClick={handleRefresh}
              disabled={loading}
              variant="outline"
            >
              <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
          </div>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="all">All ({allNews.length})</TabsTrigger>
            <TabsTrigger value="seismic">Seismic ({seismicData.length})</TabsTrigger>
            <TabsTrigger value="news">News ({newsArticles.length})</TabsTrigger>
            <TabsTrigger value="india">India ({indiaNews.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {renderTabContent(allNews, 'No earthquake data available')}
          </TabsContent>
          
          <TabsContent value="seismic">
            {renderTabContent(seismicData, 'No seismic data available')}
          </TabsContent>
          
          <TabsContent value="news">
            {renderTabContent(newsArticles, 'No news articles available')}
          </TabsContent>
          
          <TabsContent value="india">
            {renderTabContent(indiaNews, 'No India-specific earthquake data found')}
          </TabsContent>
        </Tabs>

        <div className="mt-12 pt-6 border-t">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Data Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-500" />
                <span><strong>USGS:</strong> United States Geological Survey</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-blue-500" />
                <span><strong>Real-time:</strong> Updated continuously</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-4">
              Data is fetched from reliable government sources and updated automatically. 
              Earthquake magnitudes 2.5+ are shown for the past week.
            </p>
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default LatestNews;