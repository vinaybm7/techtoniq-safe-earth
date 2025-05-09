
import { Phone, Landmark, MapPin, Mail } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

const EmergencyResources = () => {
  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { label: "Emergency Resources" }
        ]}
      />
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
              <h2 className="text-xl font-semibold text-techtoniq-earth-dark">Emergency Contact Numbers</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">National Emergency Number (India)</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">112</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Earthquake Helpline Service</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">1092</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">NDRF Helpline (National Disaster Response Force)</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">011-24363260, 9711077372</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Police Control Room</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">100</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Medical Emergency</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">108</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Fire Emergency</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">101</p>
              </div>
            </div>
          </div>

          <div className="mb-12 rounded-lg border bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Mail className="h-5 w-5 text-techtoniq-blue" />
              <h2 className="text-xl font-semibold text-techtoniq-earth-dark">Official Email Addresses</h2>
            </div>
            <div className="space-y-4">
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">National Emergency Response Center</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">dresponse-nerc@gov.in</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">NDMA Control Room</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">controlroom@ndma.gov.in</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Assam State Disaster Management Authority</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">sdma-assam@gov.in</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Himachal Pradesh Revenue Secretary</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">revsecy-hp@nic.in</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Gujarat State Disaster Management Authority</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">gsdma@gujarat.gov.in</p>
              </div>
              <div className="rounded-lg border border-dashed border-gray-200 p-4">
                <h3 className="font-medium text-techtoniq-earth-dark">Maharashtra Relief and Rehabilitation</h3>
                <p className="mt-1 text-sm text-techtoniq-earth">maha.relief@maharashtra.gov.in</p>
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
                  If you're in immediate danger, call 112. Give your location and clearly describe your situation.
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
                  Contact your local district collector's office or state disaster management authority for assistance after a disaster event.
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
