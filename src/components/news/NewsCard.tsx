import { ExternalLink, Globe, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NewsArticle } from '@/types/news';

interface NewsCardProps {
  article: NewsArticle;
}

export const NewsCard = ({ article }: NewsCardProps) => {
  return (
    <Card className="h-full flex flex-col">
      {article.image && (
        <div className="relative h-40 w-full">
          <img
            src={article.image}
            alt={article.title}
            className="object-cover w-full h-full rounded-t-lg"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}
      <CardHeader className={article.image ? '' : 'pt-6'}>
        <CardTitle className="text-lg line-clamp-2">{article.title}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-sm mt-1">
          <span className="flex items-center gap-1">
            <Globe className="h-3 w-3" /> {article.source.name}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" /> {format(new Date(article.publishedAt), "MMM d, yyyy 'at' h:mm a")}
          </span>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <div className="space-y-2">
          {article.location?.region && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>
                {article.location.region}
                {article.location.country === 'India' && ' 🇮🇳'}
              </span>
            </div>
          )}
          <p className="text-sm text-muted-foreground line-clamp-3">
            {article.description || article.content?.substring(0, 200)}...
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant={article.type === 'news' ? 'default' : 'secondary'}>
              {article.type === 'news' ? 'News' : 'Seismic Data'}
            </Badge>
            {article.magnitude && (
              <Badge variant="outline">
                M{article.magnitude.toFixed(1)}
              </Badge>
            )}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" size="sm" className="w-full">
          <a 
            href={article.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1"
          >
            Read more <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default NewsCard;
