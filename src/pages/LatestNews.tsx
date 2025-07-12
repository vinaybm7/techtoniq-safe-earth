
import { useEffect, useState, useCallback } from "react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { fetchEarthquakeNews, fetchIndiaEarthquakes, fetchNewsOnly, fetchSeismicOnly } from "@/services/newsService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, MapPin, Activity, Clock, Globe, Newspaper, Zap, RefreshCw } from "lucide-react";
import { format } from "date-fns";

const LatestNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [indiaNews, setIndiaNews] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [seismicData, setSeismicData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const getNews = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      
      const [allArticles, indiaArticles, newsOnly, seismicOnly] = await Promise.all([
        fetchEarthquakeNews(),
        fetchIndiaEarthquakes(),
        fetchNewsOnly(),
        fetchSeismicOnly()
      ]);
      
      setNews(allArticles);
      setIndiaNews(indiaArticles);
      setNewsArticles(newsOnly);
      setSeismicData(seismicOnly);
      setError(null);
      setLastUpdated(new Date());
    } catch (err) {
      setError("Failed to load earthquake news. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    getNews();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(() => {
      getNews(true);
    }, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, [getNews]);

  const handleRefresh = () => {
    getNews(true);
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const formatLastUpdated = (date: Date) => {
    return format(date, "MMM d, yyyy 'at' h:mm:ss a");
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7.0) return "bg-red-500";
    if (magnitude >= 6.0) return "bg-orange-500";
    if (magnitude >= 5.0) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getTypeIcon = (type: string) => {
    return type === 'news' ? <Newspaper className="h-4 w-4" /> : <Zap className="h-4 w-4" />;
  };

  const getTypeColor = (type: string) => {
    return type === 'news' ? 'bg-blue-500' : 'bg-purple-500';
  };

  const renderNewsCard = (article: any) => (
    <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-techtoniq-blue-light">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-techtoniq-earth-dark text-lg">
            {article.title}
          </CardTitle>
          <div className="flex gap-2">
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
          <span className="text-techtoniq-blue">•</span>
          <Clock className="h-3 w-3" />
          {formatDate(article.publishedAt)}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-grow pb-3">
        <div className="space-y-3">
          {article.location?.region && article.location.region !== 'Unknown' && (
            <div className="flex items-center gap-2 text-sm text-techtoniq-earth">
              <MapPin className="h-3 w-3 text-techtoniq-blue" />
              <span className="font-medium">{article.location.region}</span>
              {article.location.country === 'India' && (
                <Badge variant="outline" className="text-xs border-techtoniq-blue text-techtoniq-blue">
                  🇮🇳 India
                </Badge>
              )}
            </div>
          )}
          
          {article.depth && (
            <div className="flex items-center gap-2 text-sm text-techtoniq-earth">
              <Activity className="h-3 w-3 text-techtoniq-teal" />
              <span>Depth: {article.depth} km</span>
            </div>
          )}
          
          <p className="text-sm text-techtoniq-earth line-clamp-3">
            {article.description}
          </p>
          
          {article.type === 'news' && article.content && (
            <div className="text-xs text-techtoniq-earth/70 line-clamp-2">
              {article.content.substring(0, 150)}...
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm" className="w-full border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1"
          >
            {article.type === 'news' ? 'Read Full Article' : 'View Details'} <ExternalLink className="h-3 w-3" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );

  const renderSkeletonCards = () => (
    <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="h-[400px] border-techtoniq-blue-light">
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

  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { href: "/", label: "Home" },
          { label: "Latest News" },
        ]}
      />
      
      <section className="bg-gradient-to-b from-techtoniq-blue-light/30 to-white py-12">
        <div className="container">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold tracking-tight text-techtoniq-earth-dark mb-4">
              Latest Earthquake News & Data
            </h1>
            <p className="text-lg text-techtoniq-earth max-w-3xl mx-auto mb-4">
              Stay informed with real-time earthquake data and comprehensive news coverage including human impact, government response, and recovery efforts from around the world.
            </p>
            
            {/* Refresh and Last Updated Info */}
            <div className="flex items-center justify-center gap-4 text-sm text-techtoniq-earth">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
              </div>
              <Button
                onClick={handleRefresh}
                disabled={refreshing}
                variant="outline"
                size="sm"
                className="border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8">
              <TabsTrigger value="all" className="text-techtoniq-earth-dark">
                All ({news.length})
              </TabsTrigger>
              <TabsTrigger value="news" className="text-techtoniq-earth-dark">
                📰 News ({newsArticles.length})
              </TabsTrigger>
              <TabsTrigger value="seismic" className="text-techtoniq-earth-dark">
                ⚡ Seismic ({seismicData.length})
              </TabsTrigger>
              <TabsTrigger value="india" className="text-techtoniq-earth-dark">
                🇮🇳 India ({indiaNews.length})
              </TabsTrigger>
              <TabsTrigger value="significant" className="text-techtoniq-earth-dark">
                Significant (M5.0+)
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              {loading ? (
                renderSkeletonCards()
              ) : error ? (
                <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center">
                  <p className="text-red-600 text-lg mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {news.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <Globe className="h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" />
                      <p className="text-lg text-techtoniq-earth-dark mb-2">No earthquake data available</p>
                      <p className="text-techtoniq-earth">Check back later for the latest seismic activity and news.</p>
                    </div>
                  ) : (
                    news.map(renderNewsCard)
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="news">
              {loading ? (
                renderSkeletonCards()
              ) : error ? (
                <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center">
                  <p className="text-red-600 text-lg mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {newsArticles.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <Newspaper className="h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" />
                      <p className="text-lg text-techtoniq-earth-dark mb-2">No news articles available</p>
                      <p className="text-techtoniq-earth">Check back later for the latest earthquake news coverage.</p>
                    </div>
                  ) : (
                    newsArticles.map(renderNewsCard)
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="seismic">
              {loading ? (
                renderSkeletonCards()
              ) : error ? (
                <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center">
                  <p className="text-red-600 text-lg mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {seismicData.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <Zap className="h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" />
                      <p className="text-lg text-techtoniq-earth-dark mb-2">No seismic data available</p>
                      <p className="text-techtoniq-earth">Check back later for the latest earthquake data.</p>
                    </div>
                  ) : (
                    seismicData.map(renderNewsCard)
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="india">
              {loading ? (
                renderSkeletonCards()
              ) : error ? (
                <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center">
                  <p className="text-red-600 text-lg mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {indiaNews.length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <MapPin className="h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" />
                      <p className="text-lg text-techtoniq-earth-dark mb-2">No recent earthquakes in India</p>
                      <p className="text-techtoniq-earth">This is good news! No significant seismic activity detected in India.</p>
                    </div>
                  ) : (
                    indiaNews.map(renderNewsCard)
                  )}
                </div>
              )}
            </TabsContent>

            <TabsContent value="significant">
              {loading ? (
                renderSkeletonCards()
              ) : error ? (
                <div className="bg-red-50 p-8 rounded-lg border border-red-200 text-center">
                  <p className="text-red-600 text-lg mb-4">{error}</p>
                  <Button
                    variant="outline"
                    onClick={handleRefresh}
                    className="border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white"
                  >
                    Try Again
                  </Button>
                </div>
              ) : (
                <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                  {news.filter(article => (article.magnitude || 0) >= 5.0).length === 0 ? (
                    <div className="col-span-full text-center py-16">
                      <Activity className="h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" />
                      <p className="text-lg text-techtoniq-earth-dark mb-2">No significant earthquakes</p>
                      <p className="text-techtoniq-earth">No earthquakes with magnitude 5.0 or higher detected recently.</p>
                    </div>
                  ) : (
                    news
                      .filter(article => (article.magnitude || 0) >= 5.0)
                      .map(renderNewsCard)
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>

          <div className="mt-12 p-6 bg-techtoniq-blue-light/20 rounded-lg border border-techtoniq-blue-light">
            <h3 className="text-lg font-semibold text-techtoniq-earth-dark mb-3">Data & News Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-techtoniq-earth">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-techtoniq-purple" />
                <span><strong>USGS:</strong> United States Geological Survey</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-techtoniq-teal" />
                <span><strong>EMSC:</strong> European-Mediterranean Seismological Centre</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-techtoniq-warning" />
                <span><strong>IRIS:</strong> Incorporated Research Institutions for Seismology</span>
              </div>
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-techtoniq-blue" />
                <span><strong>The Guardian:</strong> International news coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-techtoniq-green" />
                <span><strong>Reuters:</strong> Global news agency</span>
              </div>
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-techtoniq-orange" />
                <span><strong>Times of India:</strong> Indian news coverage</span>
              </div>
              <div className="flex items-center gap-2">
                <Newspaper className="h-4 w-4 text-techtoniq-red" />
                <span><strong>Hindustan Times:</strong> Indian news coverage</span>
              </div>
            </div>
            <div className="mt-4 p-3 bg-white/50 rounded-md">
              <p className="text-xs text-techtoniq-earth-dark">
                <strong>News Coverage Includes:</strong> Human impact, injuries, damage assessment, government response, 
                rescue operations, relief efforts, infrastructure status, and recovery updates.
              </p>
              <p className="text-xs text-techtoniq-earth-dark mt-2">
                <strong>Auto-refresh:</strong> Data updates automatically every 5 minutes. Click "Refresh" for immediate updates.
              </p>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default LatestNews;
