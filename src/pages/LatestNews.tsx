
import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { fetchEarthquakeNews, fetchIndiaEarthquakes } from "@/services/newsService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, MapPin, Activity, Clock, Globe } from "lucide-react";
import { format } from "date-fns";

const LatestNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [indiaNews, setIndiaNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const [allArticles, indiaArticles] = await Promise.all([
          fetchEarthquakeNews(),
          fetchIndiaEarthquakes()
        ]);
        setNews(allArticles);
        setIndiaNews(indiaArticles);
        setError(null);
      } catch (err) {
        setError("Failed to load earthquake news. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getNews();
  }, []);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch (e) {
      return dateString;
    }
  };

  const getMagnitudeColor = (magnitude: number) => {
    if (magnitude >= 7.0) return "bg-red-500";
    if (magnitude >= 6.0) return "bg-orange-500";
    if (magnitude >= 5.0) return "bg-yellow-500";
    return "bg-green-500";
  };

  const getMagnitudeText = (magnitude: number) => {
    if (magnitude >= 7.0) return "Major";
    if (magnitude >= 6.0) return "Strong";
    if (magnitude >= 5.0) return "Moderate";
    return "Light";
  };

  const renderNewsCard = (article: any) => (
    <Card key={article.id} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-techtoniq-blue-light">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="line-clamp-2 text-techtoniq-earth-dark text-lg">
            {article.title}
          </CardTitle>
          {article.magnitude && (
            <Badge className={`${getMagnitudeColor(article.magnitude)} text-white font-bold`}>
              M{article.magnitude}
            </Badge>
          )}
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
          {article.location?.region && (
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
            View Details <ExternalLink className="h-3 w-3" />
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
              <Skeleton className="h-6 w-12" />
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
              Latest Earthquake News
            </h1>
            <p className="text-lg text-techtoniq-earth max-w-2xl mx-auto">
              Stay informed with real-time earthquake data from multiple authoritative sources including USGS, EMSC, and IRIS.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="all" className="text-techtoniq-earth-dark">
                All Earthquakes ({news.length})
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
                    onClick={() => window.location.reload()}
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
                      <p className="text-techtoniq-earth">Check back later for the latest seismic activity.</p>
                    </div>
                  ) : (
                    news.map(renderNewsCard)
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
                    onClick={() => window.location.reload()}
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
                      <p className="text-techtoniq-earth">This is good news! No significant seismic activity detected.</p>
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
                    onClick={() => window.location.reload()}
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
            <h3 className="text-lg font-semibold text-techtoniq-earth-dark mb-3">Data Sources</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-techtoniq-earth">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-techtoniq-blue" />
                <span><strong>USGS:</strong> United States Geological Survey</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-techtoniq-teal" />
                <span><strong>EMSC:</strong> European-Mediterranean Seismological Centre</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-techtoniq-warning" />
                <span><strong>IRIS:</strong> Incorporated Research Institutions for Seismology</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default LatestNews;
