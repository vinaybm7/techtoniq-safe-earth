
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Calendar, Filter, HelpCircle, List, MapPin, Zap } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import EarthquakeCard from "@/components/EarthquakeCard";
import EarthquakeFilter from "@/components/EarthquakeFilter";
import { fetchEarthquakesByTimeframe } from "@/services/earthquakeService";
import USGSEarthquakeMapData from "@/components/USGSEarthquakeMapData";

const RealTimeData = () => {
  const { toast } = useToast();
  const [timeframe, setTimeframe] = useState<"hour" | "day" | "week" | "month">("day");
  const [view, setView] = useState<"list" | "map">("map");
  const [filterVisible, setFilterVisible] = useState(false);
  const [minMagnitude, setMinMagnitude] = useState(0);

  // Query for earthquake data
  const { data: earthquakes, isLoading, error } = useQuery({
    queryKey: ["earthquakes", timeframe],
    queryFn: () => fetchEarthquakesByTimeframe(timeframe),
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchInterval: 1000 * 60 * 5, // 5 minutes
  });

  // Filter earthquakes
  const filteredEarthquakes = earthquakes?.filter((eq) => eq.magnitude >= minMagnitude) || [];

  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { label: "Real-Time Data" },
        ]}
      />
      <section className="bg-techtoniq-blue-light/20 py-12">
        <div className="container">
          <h1 className="mb-2 text-3xl font-bold text-techtoniq-earth-dark">
            Real-Time Earthquake Data
          </h1>
          <p className="mb-6 text-techtoniq-earth">
            Latest earthquake information from around the world
          </p>

          <div className="flex flex-wrap gap-3">
            <RadioGroup
              value={timeframe}
              onValueChange={(value) => setTimeframe(value as "hour" | "day" | "week" | "month")}
              className="flex flex-wrap gap-2"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="hour" id="hour" />
                <Label htmlFor="hour">Past Hour</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="day" id="day" />
                <Label htmlFor="day">Past Day</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="week" id="week" />
                <Label htmlFor="week">Past Week</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="month" id="month" />
                <Label htmlFor="month">Past Month</Label>
              </div>
            </RadioGroup>

            <div className="ml-auto flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setFilterVisible(!filterVisible)}
              >
                <Filter className="mr-1 h-4 w-4" />
                Filter
              </Button>
              <Button
                variant={view === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("list")}
              >
                <List className="mr-1 h-4 w-4" />
                List
              </Button>
              <Button
                variant={view === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setView("map")}
              >
                <MapPin className="mr-1 h-4 w-4" />
                Map
              </Button>
            </div>
          </div>

          {filterVisible && (
            <div className="mt-6">
              <EarthquakeFilter
                minMagnitude={minMagnitude}
                setMinMagnitude={setMinMagnitude}
              />
            </div>
          )}
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          {isLoading && (
            <div className="flex h-64 items-center justify-center">
              <div className="text-center">
                <div className="mb-4 h-12 w-12 animate-spin rounded-full border-4 border-techtoniq-blue border-t-transparent"></div>
                <p className="text-techtoniq-earth">Loading earthquake data...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-center">
              <AlertTriangle className="mx-auto mb-2 h-8 w-8 text-red-500" />
              <h3 className="mb-1 font-semibold text-red-800">Error Loading Data</h3>
              <p className="text-sm text-red-700">
                We encountered an issue while fetching earthquake data. Please try again later.
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => window.location.reload()}
              >
                Retry
              </Button>
            </div>
          )}

          {!isLoading && !error && (
            <>
              {view === "list" ? (
                <div>
                  <div className="mb-4">
                    <p className="text-sm text-techtoniq-earth">
                      Showing {filteredEarthquakes.length} earthquakes
                      {minMagnitude > 0 &&
                        ` with magnitude ${minMagnitude}+`}
                    </p>
                  </div>
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {filteredEarthquakes.map((earthquake) => (
                      <EarthquakeCard key={earthquake.id} earthquake={earthquake} />
                    ))}
                  </div>

                  {filteredEarthquakes.length === 0 && (
                    <div className="my-12 text-center">
                      <HelpCircle className="mx-auto mb-2 h-12 w-12 text-gray-400" />
                      <h2 className="mb-1 text-lg font-medium">No earthquakes found</h2>
                      <p className="text-techtoniq-earth">
                        No earthquakes match your current filters. Try adjusting your search criteria.
                      </p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-lg border shadow-sm">
                  <USGSEarthquakeMapData 
                    width="100%" 
                    height="600px"
                    earthquakes={filteredEarthquakes}
                    isLoading={isLoading}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="bg-techtoniq-teal-light/20 py-8">
        <div className="container">
          <div className="rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-techtoniq-teal-light">
                <Calendar className="h-5 w-5 text-techtoniq-teal" />
              </div>
              <div>
                <h3 className="font-medium text-techtoniq-earth-dark">Data Updates</h3>
                <p className="text-sm text-techtoniq-earth">
                  Earthquake data is sourced from USGS and refreshed every 5 minutes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default RealTimeData;
