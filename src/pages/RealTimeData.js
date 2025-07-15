import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Activity, Info, Search } from "lucide-react";
import { LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger, MobileTabsDropdown } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/PageLayout";
import EarthquakeCard from "@/components/EarthquakeCard";
import { fetchRecentEarthquakes, fetchEarthquakesByTimeframe, fetchHistoricalIndianEarthquakes } from "@/services/earthquakeService";
import { useToast } from "@/hooks/use-toast";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import AIEarthquakePrediction from "@/components/AIEarthquakePrediction";
import USGSShakeAlert from "@/components/USGSShakeAlert";
import EarthquakeFilter from "@/components/EarthquakeFilter";
import { useIsMobile } from "@/hooks/use-mobile";
const tabOptions = [
    { value: "ai-prediction", label: "AI Earthquake Prediction" },
    { value: "latest", label: "Latest Events" },
    { value: "intensity", label: "Intensity Charts" },
];
const RealTimeData = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [displayLimit, setDisplayLimit] = useState(10);
    const { toast } = useToast();
    const [filters, setFilters] = useState({
        minMagnitude: 0,
        maxMagnitude: 10,
        timeframe: 'all',
        region: 'all',
        sortBy: 'latest',
    });
    const isMobile = useIsMobile();
    const [tabValue, setTabValue] = useState("ai-prediction");
    // Determine which API call to use based on the timeframe filter
    const queryKey = ['earthquakes', filters.timeframe, filters.region];
    const { data: earthquakes, isLoading, error } = useQuery({
        queryKey,
        queryFn: async () => {
            // Special case: If region is India, use the historical Indian earthquakes endpoint
            if (filters.region === 'india') {
                console.log("Fetching historical Indian earthquakes");
                return fetchHistoricalIndianEarthquakes();
            }
            else if (filters.timeframe === 'all' || filters.timeframe === 'today') {
                return fetchRecentEarthquakes();
            }
            else {
                // For 'week' and 'month', use the specific API endpoints
                const timeframe = filters.timeframe;
                return fetchEarthquakesByTimeframe(timeframe);
            }
        },
        refetchInterval: 300000, // Refresh every 5 minutes
        meta: {
            onSettled: (data, error) => {
                if (error) {
                    toast({
                        title: "Error",
                        description: "Failed to fetch earthquake data. Please try again later.",
                        variant: "destructive",
                    });
                }
            },
        },
    });
    // Apply filters to earthquakes
    const filteredEarthquakes = earthquakes?.filter((quake) => {
        // Apply magnitude filter
        if (quake.magnitude < filters.minMagnitude || quake.magnitude > filters.maxMagnitude) {
            return false;
        }
        // Apply search term filter
        if (searchTerm && !quake.location.toLowerCase().includes(searchTerm.toLowerCase())) {
            return false;
        }
        // Apply region filter
        if (filters.region !== 'all') {
            // Skip this check for India as it's already handled at the API level with enhanced filtering
            if (filters.region === 'india') {
                return true;
            }
            const regionMapping = {
                'asia': ['japan', 'china', 'indonesia', 'philippines', 'thailand', 'malaysia', 'vietnam', 'nepal', 'bhutan', 'bangladesh', 'pakistan', 'sri lanka', 'myanmar'],
                'europe': ['italy', 'greece', 'turkey', 'iceland', 'spain', 'portugal', 'france', 'germany', 'uk', 'ireland', 'norway', 'sweden', 'finland', 'russia', 'ukraine'],
                'northamerica': ['alaska', 'california', 'mexico', 'nevada', 'washington', 'oregon', 'canada', 'united states', 'guatemala', 'honduras', 'costa rica', 'panama'],
                'southamerica': ['chile', 'peru', 'ecuador', 'colombia', 'argentina', 'bolivia', 'brazil', 'venezuela', 'guyana', 'suriname', 'paraguay', 'uruguay'],
                'africa': ['kenya', 'ethiopia', 'south africa', 'morocco', 'algeria', 'egypt', 'tanzania', 'zambia', 'zimbabwe', 'mozambique', 'nigeria', 'ghana'],
                'oceania': ['new zealand', 'australia', 'papua', 'fiji', 'solomon', 'vanuatu', 'tonga', 'samoa', 'micronesia'],
                'antarctica': ['antarctica']
            };
            // Check if the region exists in our mapping before using .some()
            const regionsToCheck = regionMapping[filters.region];
            if (!regionsToCheck) {
                console.warn(`Unknown region filter: ${filters.region}`);
                return true; // Don't filter if region is unknown
            }
            if (!regionsToCheck.some(region => quake.location.toLowerCase().includes(region))) {
                return false;
            }
        }
        return true;
    }) || [];
    // Sort earthquakes based on filter
    const sortedEarthquakes = [...filteredEarthquakes].sort((a, b) => {
        switch (filters.sortBy) {
            case 'latest':
                // Sort by date (newest first)
                return new Date(b.date).getTime() - new Date(a.date).getTime();
            case 'magnitude':
                // Sort by magnitude (highest first)
                return b.magnitude - a.magnitude;
            case 'location':
                // Sort alphabetically by location
                return a.location.localeCompare(b.location);
            default:
                return 0;
        }
    });
    // Limit the number of displayed earthquakes
    const limitedEarthquakes = sortedEarthquakes.slice(0, displayLimit);
    // Format the current time in IST
    const getCurrentISTTime = () => {
        const now = new Date();
        return now.toLocaleString('en-US', {
            timeZone: 'Asia/Kolkata',
            dateStyle: 'full',
            timeStyle: 'long'
        });
    };
    // State for current IST time
    const [currentTime, setCurrentTime] = useState(getCurrentISTTime());
    // Update time every minute
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(getCurrentISTTime());
        }, 60000);
        return () => clearInterval(timer);
    }, []);
    // Map-related functions removed
    return (_jsxs(PageLayout, { children: [_jsx(PageBreadcrumbs, { items: [
                    { label: "Real-Time Data" }
                ] }), _jsx("section", { className: "bg-techtoniq-blue-light/30 py-12", children: _jsxs("div", { className: "container", children: [_jsx("h1", { className: "mb-4 text-3xl font-bold text-techtoniq-earth-dark", children: "Real-Time Earthquake Data" }), _jsx("p", { className: "text-techtoniq-earth", children: "Stay informed with the latest earthquake information from around the world" })] }) }), _jsx("section", { className: "py-12", children: _jsx("div", { className: "container", children: _jsxs(Tabs, { value: tabValue, onValueChange: setTabValue, className: "w-full", children: [_jsx(MobileTabsDropdown, { value: tabValue, onValueChange: setTabValue, options: tabOptions }), _jsxs(TabsList, { className: "mb-8 grid w-full grid-cols-3", children: [_jsx(TabsTrigger, { value: "ai-prediction", children: "AI Earthquake Prediction" }), _jsx(TabsTrigger, { value: "latest", children: "Latest Events" }), _jsx(TabsTrigger, { value: "intensity", children: "Intensity Charts" })] }), _jsx(TabsContent, { value: "latest", className: "animate-fade-in", children: _jsxs("div", { className: "mb-6", children: [_jsxs("div", { className: "mb-4 flex flex-col gap-4", children: [_jsxs("div", { className: "relative max-w-md", children: [_jsx(Search, { className: "absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" }), _jsx(Input, { placeholder: "Search by location...", className: "pl-10", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) })] }), _jsx(EarthquakeFilter, { onFilterChange: setFilters, displayLimit: displayLimit, onDisplayLimitChange: setDisplayLimit })] }), isLoading ? (_jsxs("div", { className: "flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50", children: [_jsx("div", { className: "h-8 w-8 animate-spin rounded-full border-4 border-techtoniq-blue border-t-transparent" }), _jsx("p", { className: "mt-4 text-techtoniq-earth", children: "Loading earthquake data..." })] })) : error ? (_jsxs("div", { className: "flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50", children: [_jsx(Info, { className: "mb-2 h-10 w-10 text-techtoniq-alert" }), _jsx("p", { className: "text-techtoniq-earth", children: "Failed to load earthquake data" })] })) : limitedEarthquakes.length > 0 ? (_jsx("div", { className: "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", children: limitedEarthquakes.map((quake) => (_jsx(EarthquakeCard, { ...quake }, quake.id))) })) : (_jsxs("div", { className: "flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50", children: [_jsx(Info, { className: "mb-2 h-10 w-10 text-gray-400" }), _jsx("p", { className: "text-techtoniq-earth", children: "No earthquakes found matching your search" })] })), filters.region === 'india' && limitedEarthquakes.length > 0 && (_jsxs("div", { className: "mt-6 rounded-md bg-blue-50 p-4 text-blue-800", children: [_jsx("p", { className: "font-medium", children: "Showing historical earthquake data for India" }), _jsx("p", { className: "text-sm", children: "Displaying data from the last 10 years plus significant earthquakes (M4.5+) from earlier periods." })] })), _jsx("div", { className: "mt-8 flex justify-center", children: _jsxs("div", { className: "rounded-lg bg-techtoniq-teal-light p-4 text-center text-sm", children: [_jsx("p", { className: "font-medium text-techtoniq-teal-dark", children: "Data is refreshed every 5 minutes" }), _jsxs("p", { className: "mt-1 text-techtoniq-earth", children: ["Current IST time: ", currentTime] })] }) })] }) }), _jsx(TabsContent, { value: "ai-prediction", className: "animate-fade-in", children: _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsx("div", { className: "lg:col-span-2", children: _jsx(AIEarthquakePrediction, { earthquakes: earthquakes || [], isLoading: isLoading }) }), _jsx("div", { className: "lg:col-span-1", children: _jsx(USGSShakeAlert, { onAlertReceived: (alert) => {
                                                    console.log('ShakeAlert received:', alert);
                                                    // You could add additional handling here if needed
                                                } }) })] }) }), _jsx(TabsContent, { value: "intensity", className: "animate-fade-in", children: _jsxs("div", { className: "rounded-lg border bg-white p-6", children: [_jsx("h3", { className: "mb-6 text-xl font-medium text-techtoniq-earth-dark", children: "Global Earthquake Intensity" }), _jsx("div", { className: "mb-8 h-64 w-full rounded-lg bg-gray-50 p-4", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: [
                                                        { name: 'Jan', "Pacific Ring of Fire": 78, "Mediterranean-Himalayan Belt": 55, "Mid-Atlantic Ridge": 40, "East African Rift": 35, "North American Plate": 28 },
                                                        { name: 'Feb', "Pacific Ring of Fire": 82, "Mediterranean-Himalayan Belt": 58, "Mid-Atlantic Ridge": 42, "East African Rift": 36, "North American Plate": 29 },
                                                        { name: 'Mar', "Pacific Ring of Fire": 80, "Mediterranean-Himalayan Belt": 60, "Mid-Atlantic Ridge": 43, "East African Rift": 37, "North American Plate": 30 },
                                                        { name: 'Apr', "Pacific Ring of Fire": 85, "Mediterranean-Himalayan Belt": 62, "Mid-Atlantic Ridge": 45, "East African Rift": 38, "North American Plate": 30 },
                                                        { name: 'May', "Pacific Ring of Fire": 83, "Mediterranean-Himalayan Belt": 61, "Mid-Atlantic Ridge": 44, "East African Rift": 37, "North American Plate": 31 },
                                                        { name: 'Jun', "Pacific Ring of Fire": 87, "Mediterranean-Himalayan Belt": 64, "Mid-Atlantic Ridge": 46, "East African Rift": 39, "North American Plate": 32 },
                                                    ], margin: { top: 5, right: 30, left: 20, bottom: 5 }, children: [_jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f0f0f0" }), _jsx(XAxis, { dataKey: "name", stroke: "#888888", fontSize: 12 }), _jsx(YAxis, { stroke: "#888888", fontSize: 12 }), _jsx(Tooltip, {}), _jsx(Legend, {}), _jsx(Line, { type: "monotone", dataKey: "Pacific Ring of Fire", stroke: "#3b82f6", strokeWidth: 2, dot: { r: 3 }, activeDot: { r: 5 } }), _jsx(Line, { type: "monotone", dataKey: "Mediterranean-Himalayan Belt", stroke: "#10b981", strokeWidth: 2, dot: { r: 3 }, activeDot: { r: 5 } }), _jsx(Line, { type: "monotone", dataKey: "Mid-Atlantic Ridge", stroke: "#f59e0b", strokeWidth: 2, dot: { r: 3 }, activeDot: { r: 5 } }), _jsx(Line, { type: "monotone", dataKey: "East African Rift", stroke: "#ef4444", strokeWidth: 2, dot: { r: 3 }, activeDot: { r: 5 } }), _jsx(Line, { type: "monotone", dataKey: "North American Plate", stroke: "#8b5cf6", strokeWidth: 2, dot: { r: 3 }, activeDot: { r: 5 } })] }) }) }), _jsx("div", { className: "rounded-lg bg-gray-50 p-4", children: _jsxs("div", { className: "flex items-start gap-2", children: [_jsx(Activity, { className: "mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-blue" }), _jsxs("div", { children: [_jsx("h4", { className: "font-medium text-techtoniq-earth-dark", children: "What This Means" }), _jsx("p", { className: "mt-1 text-sm text-techtoniq-earth", children: "Intensity charts show the relative frequency and strength of earthquake activity in different regions. Higher percentages indicate more frequent and/or stronger seismic events. The Pacific Ring of Fire consistently shows the highest level of activity globally." })] })] }) })] }) })] }) }) })] }));
};
export default RealTimeData;
