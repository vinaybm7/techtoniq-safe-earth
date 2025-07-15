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
export declare const fetchEarthquakeNews: (onProgress?: (articles: NewsArticle[]) => void) => Promise<NewsArticle[]>;
export declare const fetchIndiaEarthquakes: () => Promise<NewsArticle[]>;
export declare const fetchNewsOnly: () => Promise<NewsArticle[]>;
export declare const fetchSeismicOnly: () => Promise<NewsArticle[]>;
export {};
