
import { Phone, Landmark, MapPin } from "lucide-react";
import PageLayout from "@/components/PageLayout";

const EmergencyResources = () => {
  return (
    <PageLayout>
      <section className="bg-techtoniq-alert-light/20 py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-techtoniq-earth-dark">Emergency Resources</h1>
          <p className="text-techtoniq-earth">
            Essential contacts and resources for earthquake emergencies
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mb-12 rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Phone className="h-5 w-5 text-techtoniq-blue" />
              <h2 className="text-xl font-semibold text-techtoniq-earth-dark">Phone Numbers</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Emergency Services</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">Call 911 for immediate emergency assistance</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">FEMA Helpline</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">1-800-621-3362</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Disaster Distress Helpline</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">1-800-985-5990</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Red Cross</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">1-800-733-2767</p>
              </div>
            </div>
          </div>

          <div className="mb-12 rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Landmark className="h-5 w-5 text-techtoniq-blue" />
              <h2 className="text-xl font-semibold text-techtoniq-earth-dark">How to Access Help</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Immediate Emergency</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">
                  If you're in immediate danger, call 911. Give your location and clearly describe your situation.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Evacuation Centers</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">
                  During large-scale emergencies, local authorities will establish evacuation centers. Listen to emergency broadcasts for locations.
                </p>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Disaster Relief</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">
                  Apply for FEMA assistance online at DisasterAssistance.gov or through the FEMA mobile app after a declared disaster.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <MapPin className="h-5 w-5 text-techtoniq-blue" />
              <h2 className="text-xl font-semibold text-techtoniq-earth-dark">Resource Locations</h2>
            </div>
            <div className="flex items-center justify-center">
              <div className="flex flex-col items-center">
                <MapPin className="mb-4 h-20 w-20 text-techtoniq-blue opacity-60" />
                <p className="text-center text-techtoniq-earth">Map of resource locations would be displayed here</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default EmergencyResources;
