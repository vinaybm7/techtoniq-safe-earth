export interface NewsArticle {
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

export interface NewsData {
  all: NewsArticle[];
  news: NewsArticle[];
  seismic: NewsArticle[];
  india: NewsArticle[];
  significant: NewsArticle[];
  lastUpdated: string;
}

export interface NewsTabProps {
  articles: NewsArticle[];
  loading: boolean;
  emptyMessage: string;
}

export interface NewsCardProps {
  article: NewsArticle;
}
