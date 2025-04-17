
import { useEffect, useState } from "react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { fetchEarthquakeNews } from "@/services/newsService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import { format } from "date-fns";

const LatestNews = () => {
  const [news, setNews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getNews = async () => {
      try {
        setLoading(true);
        const articles = await fetchEarthquakeNews();
        setNews(articles);
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
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return dateString;
    }
  };

  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { href: "/", label: "Home" },
          { label: "Latest News" },
        ]}
      />
      
      <section className="container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight text-techtoniq-earth-dark mb-2">
            Latest Earthquake News
          </h1>
          <p className="text-muted-foreground">
            Stay informed with the most recent earthquake news from around the world.
          </p>
        </div>

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="h-[400px]">
                <CardHeader>
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-[180px] w-full mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-1/3" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200 text-center">
            <p className="text-red-600">{error}</p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {news.length === 0 ? (
              <p className="col-span-full text-center py-10 text-muted-foreground">
                No earthquake news available at this time.
              </p>
            ) : (
              news.map((article, index) => (
                <Card key={index} className="flex flex-col h-full">
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{article.title}</CardTitle>
                    <CardDescription>
                      {article.source?.name} • {formatDate(article.publishedAt)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {article.image && (
                      <div className="aspect-video mb-4 overflow-hidden rounded-md">
                        <img 
                          src={article.image} 
                          alt={article.title}
                          className="object-cover w-full h-full transition-transform hover:scale-105" 
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                          }}
                        />
                      </div>
                    )}
                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {article.description}
                    </p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="outline" size="sm">
                      <a 
                        href={article.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1"
                      >
                        Read More <ExternalLink className="h-3 w-3" />
                      </a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        )}
      </section>
    </PageLayout>
  );
};

export default LatestNews;
