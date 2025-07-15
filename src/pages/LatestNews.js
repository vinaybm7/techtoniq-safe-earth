import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { fetchEarthquakeNews, fetchIndiaEarthquakes, fetchNewsOnly, fetchSeismicOnly } from "@/services/newsService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger, MobileTabsDropdown } from "@/components/ui/tabs";
import { useIsMobile } from "@/hooks/use-mobile";
import { ExternalLink, MapPin, Activity, Clock, Globe, Newspaper, Zap, RefreshCw } from "lucide-react";
import { format } from "date-fns";
const NEWS_CACHE_KEY = 'cached_earthquake_news';
const NEWS_CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes
const loadCachedNews = () => {
    try {
        const cached = localStorage.getItem(NEWS_CACHE_KEY);
        if (!cached)
            return null;
        const parsed = JSON.parse(cached);
        if (!parsed.timestamp || Date.now() - parsed.timestamp > NEWS_CACHE_EXPIRY)
            return null;
        return parsed;
    }
    catch {
        return null;
    }
};
const saveCachedNews = (data) => {
    try {
        localStorage.setItem(NEWS_CACHE_KEY, JSON.stringify({ ...data, timestamp: Date.now() }));
    }
    catch { }
};
const LatestNews = () => {
    const [news, setNews] = useState([]);
    const [indiaNews, setIndiaNews] = useState([]);
    const [newsArticles, setNewsArticles] = useState([]);
    const [seismicData, setSeismicData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const isMobile = useIsMobile();
    const [lastUpdated, setLastUpdated] = useState(new Date());
    // Add a new state to track if we're showing cached data
    const [usingCache, setUsingCache] = useState(false);
    const getNews = useCallback(async (isRefresh = false) => {
        try {
            if (isRefresh) {
                setRefreshing(true);
            }
            else {
                setLoading(true);
            }
            setUsingCache(false);
            // Only use cache if not a refresh
            if (!isRefresh) {
                const cached = loadCachedNews();
                if (cached) {
                    setNews(cached.news);
                    setIndiaNews(cached.indiaNews);
                    setNewsArticles(cached.newsArticles);
                    setSeismicData(cached.seismicData);
                    setLastUpdated(new Date(cached.lastUpdated));
                    setUsingCache(true);
                    setLoading(false); // Show cached instantly
                }
            }
            // Always fetch fresh in background
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
            setUsingCache(false);
            saveCachedNews({
                news: allArticles,
                indiaNews: indiaArticles,
                newsArticles: newsOnly,
                seismicData: seismicOnly,
                lastUpdated: new Date().toISOString(),
            });
        }
        catch (err) {
            setError("Failed to load earthquake news. Please try again later.");
            console.error(err);
        }
        finally {
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
    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
        }
        catch (e) {
            return dateString;
        }
    };
    const formatLastUpdated = (date) => {
        return format(date, "MMM d, yyyy 'at' h:mm:ss a");
    };
    const getMagnitudeColor = (magnitude) => {
        if (magnitude >= 7.0)
            return "bg-red-500";
        if (magnitude >= 6.0)
            return "bg-orange-500";
        if (magnitude >= 5.0)
            return "bg-yellow-500";
        return "bg-green-500";
    };
    const getTypeIcon = (type) => {
        return type === 'news' ? _jsx(Newspaper, { className: "h-4 w-4" }) : _jsx(Zap, { className: "h-4 w-4" });
    };
    const getTypeColor = (type) => {
        return type === 'news' ? 'bg-blue-500' : 'bg-purple-500';
    };
    const renderNewsCard = (article) => (_jsxs(Card, { className: "flex flex-col h-full hover:shadow-lg transition-shadow duration-300 border-techtoniq-blue-light", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx(CardTitle, { className: "line-clamp-2 text-techtoniq-earth-dark text-lg", children: article.title }), _jsxs("div", { className: "flex gap-2", children: [article.magnitude && (_jsxs(Badge, { className: `${getMagnitudeColor(article.magnitude)} text-white font-bold`, children: ["M", article.magnitude] })), _jsxs(Badge, { className: `${getTypeColor(article.type)} text-white`, children: [getTypeIcon(article.type), _jsx("span", { className: "ml-1", children: article.type === 'news' ? 'News' : 'Seismic' })] })] })] }), _jsxs(CardDescription, { className: "flex items-center gap-2 text-sm", children: [_jsx(Globe, { className: "h-3 w-3" }), article.source?.name, _jsx("span", { className: "text-techtoniq-blue", children: "\u2022" }), _jsx(Clock, { className: "h-3 w-3" }), formatDate(article.publishedAt)] })] }), _jsx(CardContent, { className: "flex-grow pb-3", children: _jsxs("div", { className: "space-y-3", children: [article.location?.region && article.location.region !== 'Unknown' && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-techtoniq-earth", children: [_jsx(MapPin, { className: "h-3 w-3 text-techtoniq-blue" }), _jsx("span", { className: "font-medium", children: article.location.region }), article.location.country === 'India' && (_jsx(Badge, { variant: "outline", className: "text-xs border-techtoniq-blue text-techtoniq-blue", children: "\uD83C\uDDEE\uD83C\uDDF3 India" }))] })), article.depth && (_jsxs("div", { className: "flex items-center gap-2 text-sm text-techtoniq-earth", children: [_jsx(Activity, { className: "h-3 w-3 text-techtoniq-teal" }), _jsxs("span", { children: ["Depth: ", article.depth, " km"] })] })), _jsx("p", { className: "text-sm text-techtoniq-earth line-clamp-3", children: article.description }), article.type === 'news' && article.content && (_jsxs("div", { className: "text-xs text-techtoniq-earth/70 line-clamp-2", children: [article.content.substring(0, 150), "..."] }))] }) }), _jsx(CardFooter, { className: "pt-0", children: _jsx(Button, { asChild: true, variant: "outline", size: "sm", className: "w-full border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white", children: _jsxs("a", { href: article.url, target: "_blank", rel: "noopener noreferrer", className: "inline-flex items-center gap-1", children: [article.type === 'news' ? 'Read Full Article' : 'View Details', " ", _jsx(ExternalLink, { className: "h-3 w-3" })] }) }) })] }, article.id));
    const renderSkeletonCards = () => (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: [...Array(6)].map((_, i) => (_jsxs(Card, { className: "h-[400px] border-techtoniq-blue-light", children: [_jsxs(CardHeader, { className: "pb-3", children: [_jsxs("div", { className: "flex items-start justify-between gap-2", children: [_jsx(Skeleton, { className: "h-6 w-3/4" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Skeleton, { className: "h-6 w-12" }), _jsx(Skeleton, { className: "h-6 w-16" })] })] }), _jsx(Skeleton, { className: "h-4 w-1/2" })] }), _jsx(CardContent, { className: "flex-grow pb-3", children: _jsxs("div", { className: "space-y-3", children: [_jsx(Skeleton, { className: "h-4 w-2/3" }), _jsx(Skeleton, { className: "h-4 w-1/2" }), _jsx(Skeleton, { className: "h-16 w-full" })] }) }), _jsx(CardFooter, { className: "pt-0", children: _jsx(Skeleton, { className: "h-10 w-full" }) })] }, i))) }));
    const tabOptions = [
        { value: "all", label: `All (${news.length})` },
        { value: "news", label: `📰 News (${newsArticles.length})` },
        { value: "seismic", label: `⚡ Seismic (${seismicData.length})` },
        { value: "india", label: `🇮🇳 India (${indiaNews.length})` },
        { value: "significant", label: "Significant (M5.0+)" },
    ];
    return (_jsxs(PageLayout, { children: [_jsx(PageBreadcrumbs, { items: [
                    { href: "/", label: "Home" },
                    { label: "Latest News" },
                ] }), _jsx("section", { className: "bg-gradient-to-b from-techtoniq-blue-light/30 to-white py-12", children: _jsxs("div", { className: "container", children: [_jsxs("div", { className: "mb-8 text-center", children: [_jsx("h1", { className: "text-4xl font-bold tracking-tight text-techtoniq-earth-dark mb-4", children: "Latest Earthquake News & Data" }), _jsx("p", { className: "text-lg text-techtoniq-earth max-w-3xl mx-auto mb-4", children: "Stay informed with real-time earthquake data and comprehensive news coverage including human impact, government response, and recovery efforts from around the world." }), _jsxs("div", { className: "flex items-center justify-center gap-4 text-sm text-techtoniq-earth", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "h-4 w-4" }), _jsxs("span", { children: ["Last updated: ", formatLastUpdated(lastUpdated)] })] }), _jsxs(Button, { onClick: handleRefresh, disabled: refreshing, variant: "outline", size: "sm", className: "border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white", children: [_jsx(RefreshCw, { className: `h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}` }), refreshing ? 'Refreshing...' : 'Refresh'] }), usingCache && !loading && !refreshing && (_jsx("span", { className: "ml-2 text-xs text-techtoniq-blue", children: "(Showing cached news, updating in background...)" }))] })] }), _jsxs(Tabs, { value: activeTab, onValueChange: setActiveTab, className: "w-full", children: [_jsx(MobileTabsDropdown, { value: activeTab, onValueChange: setActiveTab, options: tabOptions }), _jsxs(TabsList, { className: "grid w-full grid-cols-5 mb-8", children: [_jsxs(TabsTrigger, { value: "all", className: "text-techtoniq-earth-dark", children: ["All (", news.length, ")"] }), _jsxs(TabsTrigger, { value: "news", className: "text-techtoniq-earth-dark", children: ["\uD83D\uDCF0 News (", newsArticles.length, ")"] }), _jsxs(TabsTrigger, { value: "seismic", className: "text-techtoniq-earth-dark", children: ["\u26A1 Seismic (", seismicData.length, ")"] }), _jsxs(TabsTrigger, { value: "india", className: "text-techtoniq-earth-dark", children: ["\uD83C\uDDEE\uD83C\uDDF3 India (", indiaNews.length, ")"] }), _jsx(TabsTrigger, { value: "significant", className: "text-techtoniq-earth-dark", children: "Significant (M5.0+)" })] }), _jsx(TabsContent, { value: "all", children: loading ? (renderSkeletonCards()) : error ? (_jsxs("div", { className: "bg-red-50 p-8 rounded-lg border border-red-200 text-center", children: [_jsx("p", { className: "text-red-600 text-lg mb-4", children: error }), _jsx(Button, { variant: "outline", onClick: handleRefresh, className: "border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white", children: "Try Again" })] })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: news.length === 0 ? (_jsxs("div", { className: "col-span-full text-center py-16", children: [_jsx(Globe, { className: "h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" }), _jsx("p", { className: "text-lg text-techtoniq-earth-dark mb-2", children: "No earthquake data available" }), _jsx("p", { className: "text-techtoniq-earth", children: "Check back later for the latest seismic activity and news." })] })) : (news.slice(0, 30).map(renderNewsCard)) })) }), _jsx(TabsContent, { value: "news", children: loading ? (renderSkeletonCards()) : error ? (_jsxs("div", { className: "bg-red-50 p-8 rounded-lg border border-red-200 text-center", children: [_jsx("p", { className: "text-red-600 text-lg mb-4", children: error }), _jsx(Button, { variant: "outline", onClick: handleRefresh, className: "border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white", children: "Try Again" })] })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: newsArticles.length === 0 ? (_jsxs("div", { className: "col-span-full text-center py-16", children: [_jsx(Newspaper, { className: "h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" }), _jsx("p", { className: "text-lg text-techtoniq-earth-dark mb-2", children: "No news articles available" }), _jsx("p", { className: "text-techtoniq-earth", children: "Check back later for the latest earthquake news coverage." })] })) : (newsArticles.map(renderNewsCard)) })) }), _jsx(TabsContent, { value: "seismic", children: loading ? (renderSkeletonCards()) : error ? (_jsxs("div", { className: "bg-red-50 p-8 rounded-lg border border-red-200 text-center", children: [_jsx("p", { className: "text-red-600 text-lg mb-4", children: error }), _jsx(Button, { variant: "outline", onClick: handleRefresh, className: "border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white", children: "Try Again" })] })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: seismicData.length === 0 ? (_jsxs("div", { className: "col-span-full text-center py-16", children: [_jsx(Zap, { className: "h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" }), _jsx("p", { className: "text-lg text-techtoniq-earth-dark mb-2", children: "No seismic data available" }), _jsx("p", { className: "text-techtoniq-earth", children: "Check back later for the latest earthquake data." })] })) : (seismicData.map(renderNewsCard)) })) }), _jsx(TabsContent, { value: "india", children: loading ? (renderSkeletonCards()) : error ? (_jsxs("div", { className: "bg-red-50 p-8 rounded-lg border border-red-200 text-center", children: [_jsx("p", { className: "text-red-600 text-lg mb-4", children: error }), _jsx(Button, { variant: "outline", onClick: handleRefresh, className: "border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white", children: "Try Again" })] })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: indiaNews.length === 0 ? (_jsxs("div", { className: "col-span-full text-center py-16", children: [_jsx(MapPin, { className: "h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" }), _jsx("p", { className: "text-lg text-techtoniq-earth-dark mb-2", children: "No recent earthquakes in India" }), _jsx("p", { className: "text-techtoniq-earth", children: "This is good news! No significant seismic activity detected in India." })] })) : (indiaNews.map(renderNewsCard)) })) }), _jsx(TabsContent, { value: "significant", children: loading ? (renderSkeletonCards()) : error ? (_jsxs("div", { className: "bg-red-50 p-8 rounded-lg border border-red-200 text-center", children: [_jsx("p", { className: "text-red-600 text-lg mb-4", children: error }), _jsx(Button, { variant: "outline", onClick: handleRefresh, className: "border-techtoniq-blue text-techtoniq-blue hover:bg-techtoniq-blue hover:text-white", children: "Try Again" })] })) : (_jsx("div", { className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", children: news.filter(article => (article.magnitude || 0) >= 5.0).length === 0 ? (_jsxs("div", { className: "col-span-full text-center py-16", children: [_jsx(Activity, { className: "h-16 w-16 text-techtoniq-blue-light mx-auto mb-4" }), _jsx("p", { className: "text-lg text-techtoniq-earth-dark mb-2", children: "No significant earthquakes" }), _jsx("p", { className: "text-techtoniq-earth", children: "No earthquakes with magnitude 5.0 or higher detected recently." })] })) : (news
                                            .filter(article => (article.magnitude || 0) >= 5.0)
                                            .map(renderNewsCard)) })) })] }), _jsxs("div", { className: "mt-12 p-6 bg-techtoniq-blue-light/20 rounded-lg border border-techtoniq-blue-light", children: [_jsx("h3", { className: "text-lg font-semibold text-techtoniq-earth-dark mb-3", children: "Data & News Sources" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-techtoniq-earth", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4 text-techtoniq-purple" }), _jsxs("span", { children: [_jsx("strong", { children: "USGS:" }), " United States Geological Survey"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4 text-techtoniq-teal" }), _jsxs("span", { children: [_jsx("strong", { children: "EMSC:" }), " European-Mediterranean Seismological Centre"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Zap, { className: "h-4 w-4 text-techtoniq-warning" }), _jsxs("span", { children: [_jsx("strong", { children: "IRIS:" }), " Incorporated Research Institutions for Seismology"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Newspaper, { className: "h-4 w-4 text-techtoniq-blue" }), _jsxs("span", { children: [_jsx("strong", { children: "The Guardian:" }), " International news coverage"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Newspaper, { className: "h-4 w-4 text-techtoniq-green" }), _jsxs("span", { children: [_jsx("strong", { children: "Reuters:" }), " Global news agency"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Newspaper, { className: "h-4 w-4 text-techtoniq-orange" }), _jsxs("span", { children: [_jsx("strong", { children: "Times of India:" }), " Indian news coverage"] })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Newspaper, { className: "h-4 w-4 text-techtoniq-red" }), _jsxs("span", { children: [_jsx("strong", { children: "Hindustan Times:" }), " Indian news coverage"] })] })] }), _jsxs("div", { className: "mt-4 p-3 bg-white/50 rounded-md", children: [_jsxs("p", { className: "text-xs text-techtoniq-earth-dark", children: [_jsx("strong", { children: "News Coverage Includes:" }), " Human impact, injuries, damage assessment, government response, rescue operations, relief efforts, infrastructure status, and recovery updates."] }), _jsxs("p", { className: "text-xs text-techtoniq-earth-dark mt-2", children: [_jsx("strong", { children: "Auto-refresh:" }), " Data updates automatically every 5 minutes. Click \"Refresh\" for immediate updates."] })] })] })] }) })] }));
};
export default LatestNews;
