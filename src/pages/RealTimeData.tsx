
import { Activity, Info, MapPin, Search } from "lucide-react";
import { LineChart, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line } from "recharts";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/PageLayout";
import EarthquakeCard from "@/components/EarthquakeCard";
import { 
  fetchRecentEarthquakes, 
  fetchEarthquakesByTimeframe, 
  fetchHistoricalIndianEarthquakes, 
  Earthquake 
} from "@/services/earthquakeService";
import { useToast } from "@/hooks/use-toast";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import EarthquakeMap from "@/components/EarthquakeMap";
import USGSEarthquakeMapData from "@/components/USGSEarthquakeMapData";
import AIEarthquakePrediction from "@/components/AIEarthquakePrediction";
import USGSShakeAlert from "@/components/USGSShakeAlert";
import EarthquakeFilter from "@/components/EarthquakeFilter";
import { FilterValues } from "@/components/EarthquakeFilter";

const RealTimeData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [displayLimit, setDisplayLimit] = useState(10);
  const [mapFilterType, setMapFilterType] = useState<'continent' | 'magnitude' | 'time'>('continent');
  const { toast } = useToast();
  const [filters, setFilters] = useState<FilterValues>({
    minMagnitude: 0,
    maxMagnitude: 10,
    timeframe: 'all',
    region: 'all',
    sortBy: 'latest',
  });

  // Determine which API call to use based on the timeframe filter
  const queryKey = ['earthquakes', filters.timeframe, filters.region];
  
  const { data: earthquakes, isLoading, error } = useQuery({
    queryKey,
    queryFn: async () => {
      // Special case: If region is India, use the historical Indian earthquakes endpoint
      if (filters.region === 'india') {
        console.log("Fetching historical Indian earthquakes");
        return fetchHistoricalIndianEarthquakes();
      } else if (filters.timeframe === 'all' || filters.timeframe === 'today') {
        return fetchRecentEarthquakes();
      } else {
        // For 'week' and 'month', use the specific API endpoints
        const timeframe = filters.timeframe as 'week' | 'month';
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
  const filteredEarthquakes = earthquakes?.filter((quake: Earthquake) => {
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
      
      const regionMapping: { [key: string]: string[] } = {
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
      
      if (!regionsToCheck.some(
        region => quake.location.toLowerCase().includes(region)
      )) {
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

  // Determine map timeRange based on filter selection
  const getMapTimeRange = (): 'day' | 'week' | 'month' => {
    switch (filters.timeframe) {
      case 'today': return 'day';
      case 'month': return 'month';
      default: return 'week';
    }
  };

  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { label: "Real-Time Data" }
        ]}
      />
      <section className="bg-techtoniq-blue-light/30 py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-techtoniq-earth-dark">Real-Time Earthquake Data</h1>
          <p className="text-techtoniq-earth">
            Stay informed with the latest earthquake information from around the world
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="ai-prediction" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-4">
              <TabsTrigger value="ai-prediction">AI Earthquake Prediction</TabsTrigger>
              <TabsTrigger value="latest">Latest Events</TabsTrigger>
              <TabsTrigger value="map">Earthquake Map</TabsTrigger>
              <TabsTrigger value="intensity">Intensity Charts</TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="animate-fade-in">
              <div className="mb-6">
                <div className="mb-4 flex flex-col gap-4">
                  <div className="relative max-w-md">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input
                      placeholder="Search by location..."
                      className="pl-10"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  
                  <EarthquakeFilter
                    onFilterChange={setFilters}
                    displayLimit={displayLimit}
                    onDisplayLimitChange={setDisplayLimit}
                  />
                </div>

                {isLoading ? (
                  <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-techtoniq-blue border-t-transparent"></div>
                    <p className="mt-4 text-techtoniq-earth">Loading earthquake data...</p>
                  </div>
                ) : error ? (
                  <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <Info className="mb-2 h-10 w-10 text-techtoniq-alert" />
                    <p className="text-techtoniq-earth">Failed to load earthquake data</p>
                  </div>
                ) : limitedEarthquakes.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {limitedEarthquakes.map((quake) => (
                      <EarthquakeCard key={quake.id} {...quake} />
                    ))}
                  </div>
                ) : (
                  <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                    <Info className="mb-2 h-10 w-10 text-gray-400" />
                    <p className="text-techtoniq-earth">No earthquakes found matching your search</p>
                  </div>
                )}

                {filters.region === 'india' && limitedEarthquakes.length > 0 && (
                  <div className="mt-6 rounded-md bg-blue-50 p-4 text-blue-800">
                    <p className="font-medium">Showing historical earthquake data for India</p>
                    <p className="text-sm">Displaying data from the last 10 years plus significant earthquakes (M4.5+) from earlier periods.</p>
                  </div>
                )}

                <div className="mt-8 flex justify-center">
                  <div className="rounded-lg bg-techtoniq-teal-light p-4 text-center text-sm">
                    <p className="font-medium text-techtoniq-teal-dark">
                      Data is refreshed every 5 minutes
                    </p>
                    <p className="mt-1 text-techtoniq-earth">
                      Current IST time: {currentTime}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* ShakeAlert Component */}
              <div className="lg:col-span-1">
                <USGSShakeAlert 
                  onAlertReceived={(alert) => {
                    console.log('ShakeAlert received:', alert);
                    // You could add additional handling here if needed
                  }}
                />
              </div>
            </TabsContent>

            <TabsContent value="map" className="animate-fade-in">
              <div className="rounded-lg border bg-white p-6">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
                  <h3 className="text-xl font-medium text-techtoniq-earth-dark">
                    USGS Earthquake Map
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      className={`rounded-md px-3 py-1.5 text-sm font-medium ${mapFilterType === 'continent' ? 'bg-techtoniq-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setMapFilterType('continent')}
                    >
                      View by Region
                    </button>
                    <button 
                      className={`rounded-md px-3 py-1.5 text-sm font-medium ${mapFilterType === 'magnitude' ? 'bg-techtoniq-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setMapFilterType('magnitude')}
                    >
                      View by Magnitude
                    </button>
                    <button 
                      className={`rounded-md px-3 py-1.5 text-sm font-medium ${mapFilterType === 'time' ? 'bg-techtoniq-blue text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      onClick={() => setMapFilterType('time')}
                    >
                      View by Time
                    </button>
                  </div>
                </div>
                
                <div className="h-[600px] rounded-lg border overflow-hidden">
                  <USGSEarthquakeMapData
                    height="600px"
                    earthquakes={filteredEarthquakes}
                    isLoading={isLoading}
                  />
                </div>
                
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-xs text-techtoniq-earth">Active Regions</p>
                    <p className="text-xl font-semibold text-techtoniq-earth-dark">42</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-xs text-techtoniq-earth">Monitored Zones</p>
                    <p className="text-xl font-semibold text-techtoniq-earth-dark">187</p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-3 text-center">
                    <p className="text-xs text-techtoniq-earth">Alert Areas</p>
                    <p className="text-xl font-semibold text-techtoniq-earth-dark">5</p>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
                  <p className="text-techtoniq-blue-dark font-medium">About USGS Earthquake Map</p>
                  <p className="mt-1 text-techtoniq-earth">
                    This interactive map shows earthquakes from the United States Geological Survey (USGS) 
                    with magnitude 2.5+ from the past day. You can interact with the map by zooming, 
                    panning, and clicking on earthquake markers for more details.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai-prediction" className="animate-fade-in">
              <div className="grid grid-cols-1 gap-6">
                <AIEarthquakePrediction 
                  earthquakes={earthquakes || []} 
                  isLoading={isLoading} 
                />
              </div>
            </TabsContent>

            <TabsContent value="intensity" className="animate-fade-in">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-6 text-xl font-medium text-techtoniq-earth-dark">
                  Global Earthquake Intensity
                </h3>
                <div className="mb-8 h-64 w-full rounded-lg bg-gray-50 p-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={[
                        { name: 'Jan', "Pacific Ring of Fire": 78, "Mediterranean-Himalayan Belt": 55, "Mid-Atlantic Ridge": 40, "East African Rift": 35, "North American Plate": 28 },
                        { name: 'Feb', "Pacific Ring of Fire": 82, "Mediterranean-Himalayan Belt": 58, "Mid-Atlantic Ridge": 42, "East African Rift": 36, "North American Plate": 29 },
                        { name: 'Mar', "Pacific Ring of Fire": 80, "Mediterranean-Himalayan Belt": 60, "Mid-Atlantic Ridge": 43, "East African Rift": 37, "North American Plate": 30 },
                        { name: 'Apr', "Pacific Ring of Fire": 85, "Mediterranean-Himalayan Belt": 62, "Mid-Atlantic Ridge": 45, "East African Rift": 38, "North American Plate": 30 },
                        { name: 'May', "Pacific Ring of Fire": 83, "Mediterranean-Himalayan Belt": 61, "Mid-Atlantic Ridge": 44, "East African Rift": 37, "North American Plate": 31 },
                        { name: 'Jun', "Pacific Ring of Fire": 87, "Mediterranean-Himalayan Belt": 64, "Mid-Atlantic Ridge": 46, "East African Rift": 39, "North American Plate": 32 },
                      ]}
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                      <YAxis stroke="#888888" fontSize={12} />
                      <Tooltip />
                      <Legend />
                      <Line type="monotone" dataKey="Pacific Ring of Fire" stroke="#3b82f6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Mediterranean-Himalayan Belt" stroke="#10b981" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="Mid-Atlantic Ridge" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="East African Rift" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="North American Plate" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-start gap-2">
                    <Activity className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-blue" />
                    <div>
                      <h4 className="font-medium text-techtoniq-earth-dark">What This Means</h4>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Intensity charts show the relative frequency and strength of earthquake 
                        activity in different regions. Higher percentages indicate more frequent 
                        and/or stronger seismic events. The Pacific Ring of Fire consistently 
                        shows the highest level of activity globally.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>
    </PageLayout>
  );
};

export default RealTimeData;
