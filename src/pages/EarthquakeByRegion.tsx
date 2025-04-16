import { MapPin, Map } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

const EarthquakeByRegion = () => {
  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { label: "Earthquake by Region" }
        ]}
      />
      <section className="bg-techtoniq-blue-light/30 py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-techtoniq-earth-dark">Earthquake by Region</h1>
          <p className="text-techtoniq-earth">
            Explore seismic data by geographic area
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mb-8">
            <h2 className="mb-4 text-xl font-semibold text-techtoniq-earth-dark">Select Region</h2>
            <Select>
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue placeholder="Select a region" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="north-america">North America</SelectItem>
                <SelectItem value="south-america">South America</SelectItem>
                <SelectItem value="europe">Europe</SelectItem>
                <SelectItem value="asia">Asia</SelectItem>
                <SelectItem value="australia">Australia & Oceania</SelectItem>
                <SelectItem value="africa">Africa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mb-12 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">Regional Earthquakes</h2>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <MapPin className="mb-4 h-20 w-20 text-techtoniq-blue opacity-60" />
                <p className="text-center text-techtoniq-earth">Regional earthquake data would be displayed here</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">Regional Map</h2>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <Map className="mb-4 h-20 w-20 text-techtoniq-blue opacity-60" />
                <p className="text-center text-techtoniq-earth">Regional earthquake map would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EarthquakeByRegion;
