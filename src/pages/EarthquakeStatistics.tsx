import { BarChart, BookOpen, LineChart } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

const EarthquakeStatistics = () => {
  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { label: "Earthquake Statistics" }
        ]}
      />
      <section className="bg-techtoniq-blue-light/30 py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-techtoniq-earth-dark">Earthquake Statistics</h1>
          <p className="text-techtoniq-earth">
            Comprehensive data and trends on global earthquake activity
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mb-12 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">Global Statistics</h2>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <BarChart className="mb-4 h-20 w-20 text-techtoniq-blue opacity-60" />
                <p className="text-center text-techtoniq-earth">Global earthquake statistics would be displayed here</p>
              </div>
            </div>
          </div>

          <div className="mb-12 rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">Yearly Trends</h2>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <LineChart className="mb-4 h-20 w-20 text-techtoniq-blue opacity-60" />
                <p className="text-center text-techtoniq-earth">Yearly earthquake trends would be displayed here</p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">Understanding the Data</h2>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <BookOpen className="mb-4 h-20 w-20 text-techtoniq-blue opacity-60" />
                <p className="text-center text-techtoniq-earth">Explanations about earthquake data would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EarthquakeStatistics;
