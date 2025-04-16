import { BookOpen, PlayCircle, ScrollText } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

const EducationalMaterials = () => {
  return (
    <PageLayout>
      <PageBreadcrumbs
        items={[
          { label: "Educational Materials" }
        ]}
      />
      <section className="bg-techtoniq-teal-light/30 py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-techtoniq-earth-dark">Educational Materials</h1>
          <p className="text-techtoniq-earth">
            Resources to help you understand earthquakes and how to prepare for them
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <Tabs defaultValue="understanding" className="w-full">
            <TabsList className="mb-8 grid w-full grid-cols-3">
              <TabsTrigger value="understanding">Understanding Earthquakes</TabsTrigger>
              <TabsTrigger value="occurrence">How Earthquakes Occur</TabsTrigger>
              <TabsTrigger value="glossary">Glossary of Terms</TabsTrigger>
            </TabsList>

            {/* Understanding Earthquakes Tab */}
            <TabsContent value="understanding" className="animate-fade-in">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-techtoniq-teal" />
                  <h2 className="text-xl font-semibold text-techtoniq-earth-dark">Understanding Earthquakes</h2>
                </div>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div className="overflow-hidden rounded-md border">
                    <div className="aspect-video bg-gray-100"></div>
                    <div className="p-4">
                      <h3 className="mb-1 font-medium text-techtoniq-earth-dark">What is an Earthquake?</h3>
                      <p className="text-sm text-techtoniq-earth">
                        An introduction to the basics of seismic activity and its impact.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-md border">
                    <div className="aspect-video bg-gray-100"></div>
                    <div className="p-4">
                      <h3 className="mb-1 font-medium text-techtoniq-earth-dark">Measuring Earthquakes</h3>
                      <p className="text-sm text-techtoniq-earth">
                        Learn how scientists measure and classify earthquake intensity.
                      </p>
                    </div>
                  </div>
                  <div className="overflow-hidden rounded-md border">
                    <div className="aspect-video bg-gray-100"></div>
                    <div className="p-4">
                      <h3 className="mb-1 font-medium text-techtoniq-earth-dark">Understanding Seismic Waves</h3>
                      <p className="text-sm text-techtoniq-earth">
                        Exploring the types of waves that travel through the Earth during an earthquake.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* How Earthquakes Occur Tab */}
            <TabsContent value="occurrence" className="animate-fade-in">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <PlayCircle className="h-5 w-5 text-techtoniq-teal" />
                  <h2 className="text-xl font-semibold text-techtoniq-earth-dark">How Earthquakes Occur</h2>
                </div>
                <div className="mb-6 aspect-video rounded-lg bg-gray-100">
                  <div className="flex h-full items-center justify-center">
                    <PlayCircle className="h-16 w-16 text-gray-400" />
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Tectonic Plates</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      The Earth's crust is divided into large pieces called tectonic plates. These plates are constantly moving, although very slowly, and interact at their boundaries.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Fault Lines</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      Earthquakes occur along fault lines, which are fractures in the Earth's crust where tectonic plates meet and move against each other.
                    </p>
                  </div>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Energy Release</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      As plates move, they can get stuck at their edges due to friction. When the stress on the edge overcomes the friction, the plates slip, releasing energy in the form of seismic waves.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Glossary Tab */}
            <TabsContent value="glossary" className="animate-fade-in">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <div className="mb-6 flex items-center gap-2">
                  <ScrollText className="h-5 w-5 text-techtoniq-teal" />
                  <h2 className="text-xl font-semibold text-techtoniq-earth-dark">Glossary of Terms</h2>
                </div>
                <div className="space-y-4">
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Aftershock</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      A smaller earthquake that follows the main earthquake in the same area.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Epicenter</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      The point on the Earth's surface directly above where an earthquake originates.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Fault</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      A fracture in the Earth's crust along which blocks of the crust have moved relative to one another.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Magnitude</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      A measure of earthquake size, calculated from the amplitude of seismic waves. Each whole number increase represents about 32 times more energy.
                    </p>
                  </div>
                  <div className="border-b border-gray-100 pb-4">
                    <h3 className="font-medium text-techtoniq-earth-dark">Seismograph</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      An instrument that records the motion of the Earth's surface caused by seismic waves.
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium text-techtoniq-earth-dark">Tsunami</h3>
                    <p className="mt-1 text-sm text-techtoniq-earth">
                      A series of ocean waves generated by the displacement of water due to earthquakes, volcanic eruptions, or landslides under the sea.
                    </p>
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

export default EducationalMaterials;
