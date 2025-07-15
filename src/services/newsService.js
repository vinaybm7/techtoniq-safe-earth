// Enhanced India detection with more comprehensive keywords
const isLocationInIndia = (place) => {
    const indiaKeywords = [
        // Major cities
        'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad',
        'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam',
        'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut',
        'rajkot', 'kalyan', 'vasai', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota',
        'chandigarh', 'guwahati', 'solapur', 'hubli', 'mysore', 'gurgaon', 'noida', 'greater noida',
        // States and Union Territories
        'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra',
        'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'bihar', 'west bengal',
        'odisha', 'assam', 'punjab', 'haryana', 'himachal pradesh', 'uttarakhand',
        'jharkhand', 'chhattisgarh', 'goa', 'manipur', 'meghalaya', 'tripura',
        'nagaland', 'arunachal pradesh', 'mizoram', 'sikkim', 'andaman', 'nicobar',
        'lakshadweep', 'dadra', 'nagar haveli', 'daman', 'diu', 'chandigarh',
        // Regions and areas
        'delhi ncr', 'ncr', 'national capital region', 'konkan', 'malabar', 'coromandel',
        'deccan', 'gangetic', 'himalayan', 'northeast', 'north east', 'south india',
        'north india', 'east india', 'west india', 'central india',
        // Common terms
        'india', 'indian', 'bharat', 'hindustan', 'republic of india',
        // Recent earthquake-prone areas
        'uttarakhand', 'himachal', 'kashmir', 'ladakh', 'sikkim', 'assam', 'manipur',
        'mizoram', 'nagaland', 'arunachal', 'meghalaya', 'tripura', 'bihar', 'nepal border',
        'china border', 'pakistan border', 'bangladesh border', 'myanmar border'
    ];
    const searchText = place.toLowerCase();
    return indiaKeywords.some(keyword => searchText.includes(keyword.toLowerCase()));
};
// Helper for India detection in news articles
const isNewsAboutIndia = (text) => {
    if (!text)
        return false;
    const indiaKeywords = [
        'india', 'indian', 'bharat', 'hindustan', 'republic of india',
        'delhi', 'mumbai', 'bangalore', 'chennai', 'kolkata', 'hyderabad', 'pune', 'ahmedabad',
        'jaipur', 'lucknow', 'kanpur', 'nagpur', 'indore', 'thane', 'bhopal', 'visakhapatnam',
        'patna', 'vadodara', 'ghaziabad', 'ludhiana', 'agra', 'nashik', 'faridabad', 'meerut',
        'rajkot', 'kalyan', 'vasai', 'vijayawada', 'jodhpur', 'madurai', 'raipur', 'kota',
        'chandigarh', 'guwahati', 'solapur', 'hubli', 'mysore', 'gurgaon', 'noida', 'greater noida',
        'kerala', 'tamil nadu', 'karnataka', 'andhra pradesh', 'telangana', 'maharashtra',
        'gujarat', 'rajasthan', 'madhya pradesh', 'uttar pradesh', 'bihar', 'west bengal',
        'odisha', 'assam', 'punjab', 'haryana', 'himachal pradesh', 'uttarakhand',
        'jharkhand', 'chhattisgarh', 'goa', 'manipur', 'meghalaya', 'tripura',
        'nagaland', 'arunachal pradesh', 'mizoram', 'sikkim', 'andaman', 'nicobar',
        'lakshadweep', 'dadra', 'nagar haveli', 'daman', 'diu', 'chandigarh',
        'delhi ncr', 'ncr', 'national capital region', 'uttarakhand', 'himachal', 'kashmir', 'ladakh',
        'nepal border', 'china border', 'pakistan border', 'bangladesh border', 'myanmar border'
    ];
    const lower = text.toLowerCase();
    return indiaKeywords.some(keyword => lower.includes(keyword));
};
// Helper function to create news article from earthquake data
const createSeismicArticle = (earthquake, source, sourceUrl) => {
    let id;
    let title;
    let magnitude;
    let place;
    let time;
    let url;
    let depth;
    let coordinates;
    if ('properties' in earthquake) { // USGSEarthquake or EMSCEarthquake
        id = earthquake.id;
        // Get magnitude from either mag or magnitude property
        const quakeMagnitude = earthquake.properties.mag ?? earthquake.properties.magnitude;
        // Get place and format title
        place = earthquake.properties.place;
        title = earthquake.properties.title ||
            `Earthquake of magnitude ${quakeMagnitude} in ${place}`;
        magnitude = quakeMagnitude;
        time = earthquake.properties.time;
        url = earthquake.properties.url;
        coordinates = earthquake.geometry.coordinates;
        depth = earthquake.geometry.coordinates?.[2];
    }
    else { // IRISEvent
        id = earthquake.id;
        title = `Earthquake of magnitude ${earthquake.magnitude} in ${earthquake.location}`;
        magnitude = earthquake.magnitude;
        place = earthquake.location;
        time = earthquake.time;
        url = earthquake.url || `https://service.iris.edu/fdsnws/event/1/query?eventid=${earthquake.id}`;
        coordinates = earthquake.coordinates;
        depth = earthquake.depth;
    }
    const isIndia = isLocationInIndia(place);
    return {
        id: id,
        title: title,
        description: `A ${magnitude} magnitude earthquake occurred in ${place}. ${isIndia ? 'This event occurred in India.' : ''}`,
        content: `Earthquake Details: Magnitude ${magnitude}, Location: ${place}, Depth: ${depth || 'Unknown'} km`,
        url: url,
        image: '/placeholder.svg', // Default placeholder image
        publishedAt: new Date(time).toISOString(),
        source: {
            name: source,
            url: sourceUrl
        },
        location: {
            country: isIndia ? 'India' : 'Unknown',
            region: place || 'Unknown'
        },
        magnitude: magnitude,
        depth: depth,
        type: 'seismic'
    };
};
// Helper function to create news article from news API
const createNewsArticle = (article, source, sourceUrl) => {
    const isIndia = isNewsAboutIndia(article.title + ' ' + article.description + ' ' + (article.content || ''));
    return {
        id: article.id || Math.random().toString(36).substr(2, 9),
        title: article.title || article.webTitle,
        description: article.description || article.fields?.bodyText?.substring(0, 200) + '...' || 'No description available',
        content: article.content || article.fields?.bodyText || article.description || 'No content available',
        url: article.url || article.webUrl,
        image: article.urlToImage || article.fields?.thumbnail || '/placeholder.svg',
        publishedAt: article.publishedAt || article.webPublicationDate,
        source: {
            name: source,
            url: sourceUrl
        },
        location: {
            country: source.includes('India') || source.includes('Hindustan Times') ? 'India' : (isIndia ? 'India' : 'Unknown'),
            region: 'Unknown'
        },
        type: 'news'
    };
};
// Fetch from USGS API with broader time range and lower magnitude threshold
const fetchUSGSEarthquakes = async () => {
    try {
        // Fetch last 7 days of data to catch more recent earthquakes
        const response = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson');
        if (!response.ok) {
            throw new Error(`USGS API error: ${response.status}`);
        }
        const data = await response.json();
        return data.features
            .filter((quake) => quake.properties.mag >= 3.0) // Lower threshold to catch more events
            .slice(0, 20) // Limit to 20 most recent
            .map((quake) => createSeismicArticle(quake, 'USGS Earthquake Hazards Program', 'https://earthquake.usgs.gov'));
    }
    catch (error) {
        console.error('Error fetching USGS earthquakes:', error);
        return [];
    }
};
// Fetch from EMSC API with broader search
const fetchEMSCEarthquakes = async () => {
    try {
        const response = await fetch('https://www.seismicportal.eu/fdsnws/event/1/query?starttime=2024-01-01&endtime=2025-12-31&minmag=3.0&format=json');
        if (!response.ok) {
            throw new Error(`EMSC API error: ${response.status}`);
        }
        const data = await response.json();
        return data.features
            .slice(0, 15) // Limit to 15 most recent
            .map((quake) => createSeismicArticle(quake, 'European-Mediterranean Seismological Centre', 'https://www.emsc-csem.org'));
    }
    catch (error) {
        console.error('Error fetching EMSC earthquakes:', error);
        return [];
    }
};
// Fetch from IRIS Web Services
const fetchIRISEvents = async () => {
    try {
        const response = await fetch('https://service.iris.edu/fdsnws/event/1/query?starttime=2024-01-01&endtime=2025-12-31&minmag=3.0&format=json');
        if (!response.ok) {
            throw new Error(`IRIS API error: ${response.status}`);
        }
        const data = await response.json();
        return data.features
            .slice(0, 15) // Limit to 15 most recent
            .map((quake) => createSeismicArticle(quake, 'IRIS (Incorporated Research Institutions for Seismology)', 'https://www.iris.edu'));
    }
    catch (error) {
        console.error('Error fetching IRIS events:', error);
        return [];
    }
};
// Fetch from The Guardian API (free, no key required)
const fetchGuardianNews = async () => {
    try {
        const response = await fetch('https://content.guardianapis.com/search?q=earthquake&section=world&show-fields=thumbnail,bodyText&api-key=test');
        if (!response.ok) {
            throw new Error(`Guardian API error: ${response.status}`);
        }
        const data = await response.json();
        return data.response.results
            .slice(0, 15)
            .map(article => createNewsArticle(article, 'The Guardian', 'https://www.theguardian.com'));
    }
    catch (error) {
        console.error('Error fetching Guardian news:', error);
        return [];
    }
};
// Fetch from Reuters RSS feed (simplified)
const fetchReutersNews = async () => {
    try {
        // Using a CORS proxy to fetch RSS feed
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://feeds.reuters.com/Reuters/worldNews');
        if (!response.ok) {
            throw new Error(`Reuters RSS error: ${response.status}`);
        }
        const data = await response.json();
        return data.items
            .filter((item) => item.title.toLowerCase().includes('earthquake') ||
            item.description.toLowerCase().includes('earthquake'))
            .slice(0, 15)
            .map((item) => createNewsArticle(item, 'Reuters', 'https://www.reuters.com'));
    }
    catch (error) {
        console.error('Error fetching Reuters news:', error);
        return [];
    }
};
// Fetch from Times of India RSS (India-specific news)
const fetchTimesOfIndiaNews = async () => {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://timesofindia.indiatimes.com/rssfeedstopstories.cms');
        if (!response.ok) {
            throw new Error(`Times of India RSS error: ${response.status}`);
        }
        const data = await response.json();
        return data.items
            .filter((item) => item.title.toLowerCase().includes('earthquake') ||
            item.description.toLowerCase().includes('earthquake') ||
            item.title.toLowerCase().includes('quake') ||
            item.description.toLowerCase().includes('quake'))
            .slice(0, 10)
            .map((item) => createNewsArticle(item, 'Times of India', 'https://timesofindia.indiatimes.com'));
    }
    catch (error) {
        console.error('Error fetching Times of India news:', error);
        return [];
    }
};
// Fetch from Hindustan Times RSS (India-specific news)
const fetchHindustanTimesNews = async () => {
    try {
        const response = await fetch('https://api.rss2json.com/v1/api.json?rss_url=https://www.hindustantimes.com/feeds/rss/india-news/rssfeed.xml');
        if (!response.ok) {
            throw new Error(`Hindustan Times RSS error: ${response.status}`);
        }
        const data = await response.json();
        return data.items
            .filter((item) => item.title.toLowerCase().includes('earthquake') ||
            item.description.toLowerCase().includes('earthquake') ||
            item.title.toLowerCase().includes('quake') ||
            item.description.toLowerCase().includes('quake'))
            .slice(0, 10)
            .map((item) => createNewsArticle(item, 'Hindustan Times', 'https://www.hindustantimes.com'));
    }
    catch (error) {
        console.error('Error fetching Hindustan Times news:', error);
        return [];
    }
};
// Fetch from NewsAPI.org (worldwide earthquake news)
const fetchNewsApiOrg = async () => {
    try {
        const worldUrl = 'https://newsapi.org/v2/everything?q=earthquake&language=en&sortBy=publishedAt&pageSize=20&apiKey=d4b87e3551324d55b23a8b04822bd917';
        const response = await fetch(worldUrl);
        const data = response.ok ? await response.json() : { articles: [] };
        return data.articles
            .filter((item) => (item.title && item.title.toLowerCase().includes('earthquake')) ||
            (item.description && item.description.toLowerCase().includes('earthquake')))
            .map((item) => {
            const text = `${item.title} ${item.description} ${item.content}`;
            return {
                id: item.url || Math.random().toString(36).substr(2, 9),
                title: item.title,
                description: item.description || '',
                content: item.content || item.description || '',
                url: item.url,
                image: item.urlToImage || '/placeholder.svg',
                publishedAt: item.publishedAt,
                source: {
                    name: 'NewsAPI.org',
                    url: 'https://newsapi.org/'
                },
                location: {
                    country: isNewsAboutIndia(text) ? 'India' : 'Unknown',
                    region: isNewsAboutIndia(text) ? 'India' : 'Unknown'
                },
                type: 'news'
            };
        });
    }
    catch (error) {
        console.error('Error fetching NewsAPI.org news:', error);
        return [];
    }
};
// Fetch from NewsAPI.org (India-specific earthquake news)
const fetchNewsApiOrgIndia = async () => {
    try {
        const indiaUrl = 'https://newsapi.org/v2/everything?q=earthquake&language=en&sortBy=publishedAt&pageSize=20&apiKey=d4b87e3551324d55b23a8b04822bd917&country=in';
        const response = await fetch(indiaUrl);
        const data = response.ok ? await response.json() : { articles: [] };
        return data.articles
            .filter((item) => (item.title && item.title.toLowerCase().includes('earthquake')) ||
            (item.description && item.description.toLowerCase().includes('earthquake')))
            .map((item) => {
            return {
                id: item.url || Math.random().toString(36).substr(2, 9),
                title: item.title,
                description: item.description || '',
                content: item.content || item.description || '',
                url: item.url,
                image: item.urlToImage || '/placeholder.svg',
                publishedAt: item.publishedAt,
                source: {
                    name: 'NewsAPI.org',
                    url: 'https://newsapi.org/'
                },
                location: {
                    country: 'India',
                    region: 'Unknown' // Specific region might not be available from API
                },
                type: 'news'
            };
        });
    }
    catch (error) {
        console.error('Error fetching NewsAPI.org India news:', error);
        return [];
    }
};
// Fetch from GNews (worldwide earthquake news)
const fetchGNews = async () => {
    try {
        const worldUrl = 'https://gnews.io/api/v4/search?q=earthquake&lang=en&max=20&apikey=0f2829470d1cca9155f182ffab0cb3b2';
        const response = await fetch(worldUrl);
        const data = response.ok ? await response.json() : { articles: [] };
        return data.articles
            .filter((item) => (item.title && item.title.toLowerCase().includes('earthquake')) ||
            (item.description && item.description.toLowerCase().includes('earthquake')))
            .map((item) => {
            const text = `${item.title} ${item.description} ${item.content}`;
            return {
                id: item.url || Math.random().toString(36).substr(2, 9),
                title: item.title,
                description: item.description || '',
                content: item.content || item.description || '',
                url: item.url,
                image: item.image || '/placeholder.svg',
                publishedAt: item.publishedAt,
                source: {
                    name: 'GNews',
                    url: 'https://gnews.io/'
                },
                location: {
                    country: isNewsAboutIndia(text) ? 'India' : 'Unknown',
                    region: isNewsAboutIndia(text) ? 'India' : 'Unknown'
                },
                type: 'news'
            };
        });
    }
    catch (error) {
        console.error('Error fetching GNews news:', error);
        return [];
    }
};
// Fetch from GNews (India-specific earthquake news)
const fetchGNewsIndia = async () => {
    try {
        const indiaUrl = 'https://gnews.io/api/v4/search?q=earthquake&lang=en&country=in&max=20&apikey=0f2829470d1cca9155f182ffab0cb3b2';
        const response = await fetch(indiaUrl);
        const data = response.ok ? await response.json() : { articles: [] };
        return data.articles
            .filter((item) => (item.title && item.title.toLowerCase().includes('earthquake')) ||
            (item.description && item.description.toLowerCase().includes('earthquake')))
            .map((item) => {
            return {
                id: item.url || Math.random().toString(36).substr(2, 9),
                title: item.title,
                description: item.description || '',
                content: item.content || item.description || '',
                url: item.url,
                image: item.image || '/placeholder.svg',
                publishedAt: item.publishedAt,
                source: {
                    name: 'GNews',
                    url: 'https://gnews.io/'
                },
                location: {
                    country: 'India',
                    region: 'Unknown' // Specific region might not be available from API
                },
                type: 'news'
            };
        });
    }
    catch (error) {
        console.error('Error fetching GNews India news:', error);
        return [];
    }
};
// Fetch from Current News API (worldwide earthquake news)
const fetchCurrentNewsApi = async () => {
    try {
        const worldUrl = 'https://api.currentsapi.services/v1/search?apiKey=qVWbmf0_0vrdrjVZ5BNc5MqMf4lwI0GVeSSl3VRMaZjeNwum&language=en&keywords=earthquake';
        const response = await fetch(worldUrl);
        const data = response.ok ? await response.json() : { news: [] };
        return data.news
            .filter((item) => (item.title && item.title.toLowerCase().includes('earthquake')) ||
            (item.description && item.description.toLowerCase().includes('earthquake')))
            .map((item) => {
            const text = `${item.title} ${item.description} ${item.content}`;
            return {
                id: item.url || item.id || Math.random().toString(36).substr(2, 9),
                title: item.title,
                description: item.description || '',
                content: item.description || '',
                url: item.url || item.url,
                image: item.image || '/placeholder.svg',
                publishedAt: item.published || item.publishedAt,
                source: {
                    name: 'CurrentsAPI',
                    url: 'https://currentsapi.services/'
                },
                location: {
                    country: isNewsAboutIndia(text) ? 'India' : 'Unknown',
                    region: isNewsAboutIndia(text) ? 'India' : 'Unknown'
                },
                type: 'news'
            };
        });
    }
    catch (error) {
        console.error('Error fetching CurrentsAPI news:', error);
        return [];
    }
};
// Fetch from Current News API (India-specific earthquake news)
const fetchCurrentNewsApiIndia = async () => {
    try {
        const indiaUrl = 'https://api.currentsapi.services/v1/search?apiKey=qVWbmf0_0vrdrjVZ5BNc5MqMf4lwI0GVeSSl3VRMaZjeNwum&language=en&country=IN&keywords=earthquake';
        const response = await fetch(indiaUrl);
        const data = response.ok ? await response.json() : { news: [] };
        return data.news
            .filter((item) => (item.title && item.title.toLowerCase().includes('earthquake')) ||
            (item.description && item.description.toLowerCase().includes('earthquake')))
            .map((item) => {
            return {
                id: item.url || item.id || Math.random().toString(36).substr(2, 9),
                title: item.title,
                description: item.description || '',
                content: item.description || '',
                url: item.url || item.url,
                image: item.image || '/placeholder.svg',
                publishedAt: item.published || item.publishedAt,
                source: {
                    name: 'CurrentsAPI',
                    url: 'https://currentsapi.services/'
                },
                location: {
                    country: 'India',
                    region: 'Unknown' // Specific region might not be available from API
                },
                type: 'news'
            };
        });
    }
    catch (error) {
        console.error('Error fetching CurrentsAPI India news:', error);
        return [];
    }
};
// Main function to fetch all earthquake news
export const fetchEarthquakeNews = async () => {
    try {
        // Fetch from all sources concurrently (with NewsAPI.org, GNews, and CurrentsAPI)
        const [usgsQuakes, emscQuakes, irisEvents, guardianNews, reutersNews, toiNews, htNews, newsApiOrgNews, gnewsNews, currentNewsApiNews, newsApiOrgIndiaNews, gnewsIndiaNews, currentNewsApiIndiaNews] = await Promise.allSettled([
            fetchUSGSEarthquakes(),
            fetchEMSCEarthquakes(),
            fetchIRISEvents(),
            fetchGuardianNews(),
            fetchReutersNews(),
            fetchTimesOfIndiaNews(),
            fetchHindustanTimesNews(),
            fetchNewsApiOrg(),
            fetchGNews(),
            fetchCurrentNewsApi(),
            fetchNewsApiOrgIndia(),
            fetchGNewsIndia(),
            fetchCurrentNewsApiIndia()
        ]);
        // Combine all successful results
        const allArticles = [];
        if (usgsQuakes.status === 'fulfilled') {
            allArticles.push(...usgsQuakes.value);
        }
        if (emscQuakes.status === 'fulfilled') {
            allArticles.push(...emscQuakes.value);
        }
        if (irisEvents.status === 'fulfilled') {
            allArticles.push(...irisEvents.value);
        }
        if (guardianNews.status === 'fulfilled') {
            allArticles.push(...guardianNews.value);
        }
        if (reutersNews.status === 'fulfilled') {
            allArticles.push(...reutersNews.value);
        }
        if (toiNews.status === 'fulfilled') {
            allArticles.push(...toiNews.value);
        }
        if (htNews.status === 'fulfilled') {
            allArticles.push(...htNews.value);
        }
        if (newsApiOrgNews.status === 'fulfilled') {
            allArticles.push(...newsApiOrgNews.value);
        }
        if (gnewsNews.status === 'fulfilled') {
            allArticles.push(...gnewsNews.value);
        }
        if (currentNewsApiNews.status === 'fulfilled') {
            allArticles.push(...currentNewsApiNews.value);
        }
        if (newsApiOrgIndiaNews.status === 'fulfilled') {
            allArticles.push(...newsApiOrgIndiaNews.value);
        }
        if (gnewsIndiaNews.status === 'fulfilled') {
            allArticles.push(...gnewsIndiaNews.value);
        }
        if (currentNewsApiIndiaNews.status === 'fulfilled') {
            allArticles.push(...currentNewsApiIndiaNews.value);
        }
        // Remove duplicates based on ID
        const uniqueArticles = allArticles.filter((article, index, self) => index === self.findIndex(a => a.id === article.id));
        // Sort by priority: India first, then by type (news first), then by date
        const sortedArticles = uniqueArticles.sort((a, b) => {
            const aIsIndia = isLocationInIndia(a.location?.region || '');
            const bIsIndia = isLocationInIndia(b.location?.region || '');
            // India articles first
            if (aIsIndia && !bIsIndia)
                return -1;
            if (!aIsIndia && bIsIndia)
                return 1;
            // Then by type (news articles first, then seismic data)
            if (a.type === 'news' && b.type === 'seismic')
                return -1;
            if (a.type === 'seismic' && b.type === 'news')
                return 1;
            // Then by date (newer first)
            return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime();
        });
        // Return top 40 articles
        return sortedArticles.slice(0, 40);
    }
    catch (error) {
        console.error('Error fetching earthquake news:', error);
        return [];
    }
};
// Additional function to get India-specific earthquakes
export const fetchIndiaEarthquakes = async () => {
    try {
        const [toiNews, htNews, newsApiOrgIndiaNews, gnewsIndiaNews, currentNewsApiIndiaNews] = await Promise.allSettled([
            fetchTimesOfIndiaNews(),
            fetchHindustanTimesNews(),
            fetchNewsApiOrgIndia(),
            fetchGNewsIndia(),
            fetchCurrentNewsApiIndia()
        ]);
        const indiaArticles = [];
        if (toiNews.status === 'fulfilled') {
            indiaArticles.push(...toiNews.value);
        }
        if (htNews.status === 'fulfilled') {
            indiaArticles.push(...htNews.value);
        }
        if (newsApiOrgIndiaNews.status === 'fulfilled') {
            indiaArticles.push(...newsApiOrgIndiaNews.value);
        }
        if (gnewsIndiaNews.status === 'fulfilled') {
            indiaArticles.push(...gnewsIndiaNews.value);
        }
        if (currentNewsApiIndiaNews.status === 'fulfilled') {
            indiaArticles.push(...currentNewsApiIndiaNews.value);
        }
        // Remove duplicates based on ID
        const uniqueIndiaArticles = indiaArticles.filter((article, index, self) => index === self.findIndex(a => a.id === article.id));
        // Sort by date (newer first)
        return uniqueIndiaArticles.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
    }
    catch (error) {
        console.error('Error fetching India-specific news:', error);
        return [];
    }
};
// Function to get only news articles (not seismic data)
export const fetchNewsOnly = async () => {
    const allArticles = await fetchEarthquakeNews();
    return allArticles.filter(article => article.type === 'news');
};
// Function to get only seismic data
export const fetchSeismicOnly = async () => {
    const allArticles = await fetchEarthquakeNews();
    return allArticles.filter(article => article.type === 'seismic');
};
