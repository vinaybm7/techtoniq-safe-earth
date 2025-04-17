
interface NewsArticle {
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
}

interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

export const fetchEarthquakeNews = async (): Promise<NewsArticle[]> => {
  try {
    // Using GNews API with earthquake as the search term
    const response = await fetch(
      "https://gnews.io/api/v4/search?q=earthquake&lang=en&country=us&max=10&apikey=d68c96c0cd4eea9a7f5fb4e65b9a1ef1"
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch news: ${response.status}`);
    }
    
    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error("Error fetching earthquake news:", error);
    return [];
  }
};
