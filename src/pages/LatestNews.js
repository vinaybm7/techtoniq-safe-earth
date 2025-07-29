import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState, useCallback } from "react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { fetchEarthquakeNews, fetchIndiaEarthquakes, fetchNewsOnly, fetchSeismicOnly } from "@/services/newsService";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExternalLink, MapPin, Activity, Clock, Globe, Newspaper, Zap, RefreshCw, AlertTriangle } from "lucide-react";
import { format } from "date-fns";

const LatestNews = () => {
    const [allNews, setAllNews] = useState([]);
    const [indiaNews, setIndiaNews] = useState([]);
    const [newsArticles, setNewsArticles] = useState([]);
    const [seismicData, setSeismicData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());

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

    const getMagnitudeColor = (magnitude) => {
        if (!magnitude) return 'bg-gray-500';
        if (magnitude >= 7.0) return 'bg-red-500';
        if (magnitude >= 6.0) return 'bg-orange-500';
        if (magnitude >= 5.0) return 'bg-yellow-500';
        if (magnitude >= 4.0) return 'bg-blue-500';
        return 'bg-green-500';
    };

    const getTypeIcon = (type) => {
        return type === 'news' ? _jsx(Newspaper, { className: "h-4 w-4" }) : _jsx(Zap, { className: "h-4 w-4" });
    };

    const getTypeColor = (type) => {
        return type === 'news' ? 'bg-blue-500' : 'bg-purple-500';
    };

    const formatDate = (dateString) => {
        try {
            return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
        } catch {
            return dateString;
        }
    };

    const renderNewsCard = (article) => (_jsxs(Card, { 
        className: "flex flex-col h-full hover:shadow-lg transition-shadow duration-300", 
        children: [
            _jsxs(CardHeader, { 
                className: "pb-3", 
                children: [
                    _jsxs("div", { 
                        className: "flex items-start justify-between gap-2", 
                        children: [
                            _jsx(CardTitle, { 
                                className: "line-clamp-2 text-lg", 
                                children: article.title 
                            }),
                            _jsxs("div", { 
                                className: "flex gap-2 flex-shrink-0", 
                                children: [
                                    article.magnitude && (_jsxs(Badge, { 
                                        className: `${getMagnitudeColor(article.magnitude)} text-white font-bold`, 
                                        children: ["M", article.magnitude] 
                                    })),
                                    _jsxs(Badge, { 
                                        className: `${getTypeColor(article.type)} text-white`, 
                                        children: [
                                            getTypeIcon(article.type),
                                            _jsx("span", { 
                                                className: "ml-1", 
                                                children: article.type === 'news' ? 'News' : 'Seismic' 
                                            })
                                        ] 
                                    })
                                ] 
                            })
                        ] 
                    }),
                    _jsxs(CardDescription, { 
                        className: "flex items-center gap-2 text-sm", 
                        children: [
                            _jsx(Globe, { className: "h-3 w-3" }),
                            article.source?.name,
                            _jsx("span", { children: "•" }),
                            _jsx(Clock, { className: "h-3 w-3" }),
                            formatDate(article.publishedAt)
                        ] 
                    })
                ] 
            }),
            _jsx(CardContent, { 
                className: "flex-grow pb-3", 
                children: _jsxs("div", { 
                    className: "space-y-3", 
                    children: [
                        article.location?.region && article.location.region !== 'Unknown location' && (_jsxs("div", { 
                            className: "flex items-center gap-2 text-sm", 
                            children: [
                                _jsx(MapPin, { className: "h-3 w-3 text-blue-500" }),
                                _jsx("span", { 
                                    className: "font-medium", 
                                    children: article.location.region 
                                }),
                                article.location.country === 'India' && (_jsx(Badge, { 
                                    variant: "outline", 
                                    className: "text-xs border-blue-500 text-blue-500", 
                                    children: "🇮🇳 India" 
                                }))
                            ] 
                        })),
                        article.depth && (_jsxs("div", { 
                            className: "flex items-center gap-2 text-sm text-gray-600", 
                            children: [
                                _jsx(Activity, { className: "h-3 w-3 text-teal-500" }),
                                _jsxs("span", { children: ["Depth: ", article.depth, " km"] })
                            ] 
                        })),
                        _jsx("p", { 
                            className: "text-sm text-gray-700 line-clamp-3", 
                            children: article.description 
                        })
                    ] 
                }) 
            }),
            _jsx(CardFooter, { 
                className: "pt-0", 
                children: _jsx(Button, { 
                    asChild: true, 
                    variant: "outline", 
                    size: "sm", 
                    className: "w-full", 
                    children: _jsxs("a", { 
                        href: article.url, 
                        target: "_blank", 
                        rel: "noopener noreferrer", 
                        className: "inline-flex items-center gap-1", 
                        children: [
                            article.type === 'news' ? 'Read Article' : 'View Details',
                            _jsx(ExternalLink, { className: "h-3 w-3" })
                        ] 
                    }) 
                }) 
            })
        ] 
    }, article.id));

    const renderSkeletonCards = () => (_jsx("div", { 
        className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
        children: [...Array(6)].map((_, i) => (_jsxs(Card, { 
            className: "h-[400px]", 
            children: [
                _jsxs(CardHeader, { 
                    className: "pb-3", 
                    children: [
                        _jsxs("div", { 
                            className: "flex items-start justify-between gap-2", 
                            children: [
                                _jsx(Skeleton, { className: "h-6 w-3/4" }),
                                _jsxs("div", { 
                                    className: "flex gap-2", 
                                    children: [
                                        _jsx(Skeleton, { className: "h-6 w-12" }),
                                        _jsx(Skeleton, { className: "h-6 w-16" })
                                    ] 
                                })
                            ] 
                        }),
                        _jsx(Skeleton, { className: "h-4 w-1/2" })
                    ] 
                }),
                _jsx(CardContent, { 
                    className: "flex-grow pb-3", 
                    children: _jsxs("div", { 
                        className: "space-y-3", 
                        children: [
                            _jsx(Skeleton, { className: "h-4 w-2/3" }),
                            _jsx(Skeleton, { className: "h-4 w-1/2" }),
                            _jsx(Skeleton, { className: "h-16 w-full" })
                        ] 
                    }) 
                }),
                _jsx(CardFooter, { 
                    className: "pt-0", 
                    children: _jsx(Skeleton, { className: "h-10 w-full" }) 
                })
            ] 
        }, i))) 
    }));

    const renderTabContent = (articles, emptyMessage) => {
        if (loading) {
            return renderSkeletonCards();
        }

        if (articles.length === 0) {
            return (_jsxs("div", { 
                className: "col-span-full text-center py-12", 
                children: [
                    _jsx(Newspaper, { className: "mx-auto h-12 w-12 text-gray-400 mb-4" }),
                    _jsx("h3", { 
                        className: "text-lg font-medium text-gray-900 mb-2", 
                        children: emptyMessage 
                    }),
                    _jsx("p", { 
                        className: "text-sm text-gray-500", 
                        children: "Try refreshing the page or check back later for updates." 
                    })
                ] 
            }));
        }

        return (_jsx("div", { 
            className: "grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3", 
            children: articles.map(renderNewsCard) 
        }));
    };

    if (error) {
        return (_jsx(PageLayout, { 
            children: _jsx("div", { 
                className: "container py-12 text-center", 
                children: _jsxs("div", { 
                    className: "max-w-md mx-auto p-6 bg-white rounded-lg shadow", 
                    children: [
                        _jsx(AlertTriangle, { className: "h-12 w-12 text-red-500 mx-auto mb-4" }),
                        _jsx("h2", { 
                            className: "text-xl font-semibold text-red-700 mb-2", 
                            children: "Error Loading News" 
                        }),
                        _jsx("p", { 
                            className: "text-red-600 mb-4", 
                            children: error 
                        }),
                        _jsxs(Button, { 
                            onClick: handleRefresh, 
                            variant: "outline", 
                            children: [
                                _jsx(RefreshCw, { className: "mr-2 h-4 w-4" }), 
                                " Try Again"
                            ] 
                        })
                    ] 
                }) 
            }) 
        }));
    }

    return (_jsx(PageLayout, { 
        children: _jsxs("div", { 
            className: "container py-8", 
            children: [
                _jsx(PageBreadcrumbs, { 
                    items: [
                        { label: 'Home', href: '/' },
                        { label: 'Latest News' }
                    ], 
                    className: "mb-6" 
                }),
                _jsxs("div", { 
                    className: "flex flex-col md:flex-row md:items-center md:justify-between mb-8 gap-4", 
                    children: [
                        _jsxs("div", { 
                            children: [
                                _jsx("h1", { 
                                    className: "text-3xl font-bold tracking-tight", 
                                    children: "Latest Earthquake News" 
                                }),
                                _jsx("p", { 
                                    className: "text-gray-600 mt-2", 
                                    children: "Real-time earthquake data and news from around the world" 
                                })
                            ] 
                        }),
                        _jsxs("div", { 
                            className: "flex items-center gap-4", 
                            children: [
                                _jsxs("div", { 
                                    className: "text-sm text-gray-500", 
                                    children: ["Last updated: ", format(lastUpdated, "MMM d, yyyy 'at' h:mm a")] 
                                }),
                                _jsxs(Button, { 
                                    onClick: handleRefresh, 
                                    disabled: loading, 
                                    variant: "outline", 
                                    children: [
                                        _jsx(RefreshCw, { className: `mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}` }),
                                        loading ? 'Loading...' : 'Refresh'
                                    ] 
                                })
                            ] 
                        })
                    ] 
                }),
                _jsxs(Tabs, { 
                    defaultValue: "all", 
                    className: "w-full", 
                    children: [
                        _jsxs(TabsList, { 
                            className: "grid w-full grid-cols-4 mb-6", 
                            children: [
                                _jsxs(TabsTrigger, { 
                                    value: "all", 
                                    children: ["All (", allNews.length, ")"] 
                                }),
                                _jsxs(TabsTrigger, { 
                                    value: "seismic", 
                                    children: ["Seismic (", seismicData.length, ")"] 
                                }),
                                _jsxs(TabsTrigger, { 
                                    value: "news", 
                                    children: ["News (", newsArticles.length, ")"] 
                                }),
                                _jsxs(TabsTrigger, { 
                                    value: "india", 
                                    children: ["India (", indiaNews.length, ")"] 
                                })
                            ] 
                        }),
                        _jsx(TabsContent, { 
                            value: "all", 
                            children: renderTabContent(allNews, 'No earthquake data available') 
                        }),
                        _jsx(TabsContent, { 
                            value: "seismic", 
                            children: renderTabContent(seismicData, 'No seismic data available') 
                        }),
                        _jsx(TabsContent, { 
                            value: "news", 
                            children: renderTabContent(newsArticles, 'No news articles available') 
                        }),
                        _jsx(TabsContent, { 
                            value: "india", 
                            children: renderTabContent(indiaNews, 'No India-specific earthquake data found') 
                        })
                    ] 
                }),
                _jsx("div", { 
                    className: "mt-12 pt-6 border-t", 
                    children: _jsxs("div", { 
                        className: "bg-gray-50 p-6 rounded-lg", 
                        children: [
                            _jsx("h3", { 
                                className: "text-lg font-semibold mb-3", 
                                children: "Data Sources" 
                            }),
                            _jsxs("div", { 
                                className: "grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600", 
                                children: [
                                    _jsxs("div", { 
                                        className: "flex items-center gap-2", 
                                        children: [
                                            _jsx(Zap, { className: "h-4 w-4 text-purple-500" }),
                                            _jsxs("span", { 
                                                children: [
                                                    _jsx("strong", { children: "USGS:" }), 
                                                    " United States Geological Survey"
                                                ] 
                                            })
                                        ] 
                                    }),
                                    _jsxs("div", { 
                                        className: "flex items-center gap-2", 
                                        children: [
                                            _jsx(Globe, { className: "h-4 w-4 text-blue-500" }),
                                            _jsxs("span", { 
                                                children: [
                                                    _jsx("strong", { children: "Real-time:" }), 
                                                    " Updated continuously"
                                                ] 
                                            })
                                        ] 
                                    })
                                ] 
                            }),
                            _jsx("p", { 
                                className: "text-xs text-gray-500 mt-4", 
                                children: "Data is fetched from reliable government sources and updated automatically. Earthquake magnitudes 2.5+ are shown for the past week." 
                            })
                        ] 
                    }) 
                })
            ] 
        }) 
    }));
};

export default LatestNews;