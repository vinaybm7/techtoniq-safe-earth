import { Activity, Filter, Info, MapPin, Search } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQuery } from "@tanstack/react-query";
import PageLayout from "@/components/PageLayout";
import EarthquakeCard from "@/components/EarthquakeCard";
import { fetchRecentEarthquakes } from "@/services/earthquakeService";
import { useToast } from "@/hooks/use-toast";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

const RealTimeData = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const { data: earthquakes, isLoading, error } = useQuery({
    queryKey: ['earthquakes'],
    queryFn: fetchRecentEarthquakes,
    refetchInterval: 300000,
    meta: {
      onError: () => {
        toast({
          title: "Error",
          description: "Failed to fetch earthquake data. Please try again later.",
          variant: "destructive",
        });
      },
    },
  });

  const filteredEarthquakes = earthquakes?.filter((quake) =>
    quake.location.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const intenseRegions = [
    { region: "Pacific Ring of Fire", activity: 85 },
    { region: "Mediterranean-Himalayan Belt", activity: 62 },
    { region: "Mid-Atlantic Ridge", activity: 45 },
    { region: "East African Rift", activity: 38 },
    { region: "North American Plate", activity: 30 },
  ];

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
          <Tabs defaultValue="latest" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger value="latest">Latest Events</TabsTrigger>
              <TabsTrigger value="intensity">Intensity Charts</TabsTrigger>
              <TabsTrigger value="locations">Earthquake Locations</TabsTrigger>
            </TabsList>

            <TabsContent value="latest" className="animate-fade-in">
              <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search by location..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Filter className="h-4 w-4" />
                  <span>Filter</span>
                </Button>
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
              ) : filteredEarthquakes.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredEarthquakes.map((quake) => (
                    <EarthquakeCard key={quake.id} {...quake} />
                  ))}
                </div>
              ) : (
                <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
                  <Info className="mb-2 h-10 w-10 text-gray-400" />
                  <p className="text-techtoniq-earth">No earthquakes found matching your search</p>
                </div>
              )}

              <div className="mt-8 flex justify-center">
                <div className="rounded-lg bg-techtoniq-teal-light p-4 text-center text-sm">
                  <p className="font-medium text-techtoniq-teal-dark">
                    Data is refreshed every 5 minutes
                  </p>
                  <p className="mt-1 text-techtoniq-earth">
                    Last updated: {new Date().toLocaleString()}
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="intensity" className="animate-fade-in">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-6 text-xl font-medium text-techtoniq-earth-dark">
                  Global Earthquake Intensity
                </h3>
                <div className="mb-8 h-64 w-full rounded-lg bg-gray-50 p-4">
                  <div className="flex h-full w-full flex-col justify-between">
                    {intenseRegions.map((region, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="text-sm text-techtoniq-earth">{region.region}</span>
                        <div className="h-4 flex-1 overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-techtoniq-blue"
                            style={{ width: `${region.activity}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{region.activity}%</span>
                      </div>
                    ))}
                  </div>
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

            <TabsContent value="locations" className="animate-fade-in">
              <div className="rounded-lg border bg-white p-6">
                <h3 className="mb-6 text-xl font-medium text-techtoniq-earth-dark">
                  Global Earthquake Map
                </h3>
                <div className="aspect-[16/9] w-full overflow-hidden rounded-lg bg-gray-200">
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <MapPin className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-2 text-sm text-techtoniq-earth">
                        Interactive earthquake map would be displayed here
                      </p>
                    </div>
                  </div>
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
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">View by Continent</Button>
                  <Button variant="outline" size="sm">View by Magnitude</Button>
                  <Button variant="outline" size="sm">View by Time</Button>
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
