
import { CheckCircle2, Clock, Compass, Download, Home, Shield } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import PageLayout from "@/components/PageLayout";

const SafetyGuidelines = () => {
  return (
    <PageLayout>
      <section className="bg-techtoniq-teal-light/30 py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-techtoniq-earth-dark">Safety Guidelines</h1>
          <p className="text-techtoniq-earth">
            Essential steps to take before, during, and after an earthquake
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="mx-auto max-w-4xl space-y-12">
            {/* Before an Earthquake */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-techtoniq-blue-light">
                  <Clock className="h-5 w-5 text-techtoniq-blue" />
                </div>
                <h2 className="text-2xl font-bold text-techtoniq-earth-dark">Before an Earthquake</h2>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Develop an Emergency Plan</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Create a family emergency plan that includes meeting places, emergency contact information, and plans for different scenarios. Make sure all family members know the plan.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Prepare Emergency Supplies</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Put together an emergency kit with water, non-perishable food, first aid supplies, flashlights, batteries, medications, and other essentials. Plan for at least 72 hours of self-sufficiency.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Secure Your Home</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Bolt bookcases and tall furniture to wall studs. Secure heavy items on lower shelves. Install latches on cabinets. Secure water heaters with straps. Repair structural defects.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Know Utility Shutoffs</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Learn the location of utility shutoffs (gas, water, electricity) and how to turn them off. Keep necessary tools nearby and teach responsible family members how to use them.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Practice Drills</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Practice "drop, cover, and hold on" drills with your family regularly. Identify safe spots in each room — under sturdy tables or against interior walls away from windows.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* During an Earthquake */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-techtoniq-alert-light">
                  <Compass className="h-5 w-5 text-techtoniq-alert" />
                </div>
                <h2 className="text-2xl font-bold text-techtoniq-earth-dark">During an Earthquake</h2>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Drop, Cover, and Hold On</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Drop to your hands and knees. Cover your head and neck with your arms. If possible, seek shelter under a sturdy table or desk. Hold on to your shelter until the shaking stops.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">If Indoors</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Stay inside until the shaking stops. Stay away from windows, exterior walls, and anything that could fall. Do not use elevators. If you're in bed, stay there and cover your head with a pillow.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">If Outdoors</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Move to a clear area away from buildings, trees, streetlights, and power lines. Once in the open, drop to the ground and stay there until the shaking stops.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">If Driving</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Pull over to a clear location, stop, and set the parking brake. Avoid bridges, overpasses, and utility wires. Stay inside the vehicle until the shaking is over.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">If in a Crowded Place</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Do not rush for the exits. Take cover where you are. Move away from display shelves, windows, or other items that might fall.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* After an Earthquake */}
            <div>
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-techtoniq-teal-light">
                  <Home className="h-5 w-5 text-techtoniq-teal" />
                </div>
                <h2 className="text-2xl font-bold text-techtoniq-earth-dark">After an Earthquake</h2>
              </div>

              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <ul className="space-y-6">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Check for Injuries</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        First, check yourself for injuries and get first aid if necessary before helping others. Assist those who need special help, like infants, elderly people, and people with disabilities.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Check for Hazards</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Look for and extinguish small fires. Check for gas leaks, water leaks, or electrical shorts. Turn off damaged utilities if safe to do so. Clean up spilled medications, bleach, gasoline, or other flammable liquids.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Inspect your Home</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Check for cracks in the ceiling or foundation. Look for damage to utilities. Check for sewage and water line damage. Evacuate if your home is unsafe.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Be Prepared for Aftershocks</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Be ready for potentially strong aftershocks, especially in the first hours and days after the main quake. Each time you feel one, drop, cover, and hold on.
                      </p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-techtoniq-teal" />
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Stay Informed</h3>
                      <p className="mt-1 text-sm text-techtoniq-earth">
                        Listen to a battery-operated radio or television for the latest emergency information. Follow instructions from emergency officials. Use phones only for emergency calls.
                      </p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="mt-12">
              <h2 className="mb-6 text-2xl font-bold text-techtoniq-earth-dark">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="rounded-lg border bg-white">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="px-6 py-4 text-techtoniq-earth-dark">
                    What is the safest place to be during an earthquake?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-techtoniq-earth">
                    The safest place is under a sturdy desk or table, away from windows and exterior walls. If no shelter is available, drop to the ground against an interior wall and cover your head and neck with your arms.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2">
                  <AccordionTrigger className="px-6 py-4 text-techtoniq-earth-dark">
                    Should I run outside during an earthquake?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-techtoniq-earth">
                    No, you should not run outside during an earthquake as most injuries occur when people try to move during shaking. The area near exterior walls is particularly dangerous.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3">
                  <AccordionTrigger className="px-6 py-4 text-techtoniq-earth-dark">
                    How can I make my home more earthquake-resistant?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-techtoniq-earth">
                    Secure heavy furniture to walls, install cabinet latches, secure water heaters, reinforce chimneys, bolt the house to the foundation, and consider consulting a structural engineer for a thorough evaluation.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-4">
                  <AccordionTrigger className="px-6 py-4 text-techtoniq-earth-dark">
                    What should be in my earthquake emergency kit?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-techtoniq-earth">
                    Your kit should include water (one gallon per person per day for three days), non-perishable food, first aid supplies, flashlights, batteries, manual can opener, medications, cash, copies of important documents, and comfort items for children.
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-5">
                  <AccordionTrigger className="px-6 py-4 text-techtoniq-earth-dark">
                    When should I turn off gas after an earthquake?
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-4 pt-0 text-techtoniq-earth">
                    Turn off gas only if you smell gas (rotten egg odor), hear gas escaping, or see a broken gas line. Use a wrench to turn the valve 90 degrees so that it crosses the pipe. Once turned off, only a qualified professional should turn it back on.
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>

            <div className="flex justify-center">
              <Button className="flex items-center gap-2 bg-techtoniq-blue hover:bg-techtoniq-blue-dark">
                <Download className="h-4 w-4" />
                <span>Download Complete Safety Guide</span>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <section className="bg-techtoniq-blue-light/30 py-8">
        <div className="container">
          <div className="flex items-center justify-between rounded-lg bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-techtoniq-blue-light">
                <Shield className="h-6 w-6 text-techtoniq-blue" />
              </div>
              <div>
                <h3 className="font-medium text-techtoniq-earth-dark">Need Additional Help?</h3>
                <p className="text-sm text-techtoniq-earth">
                  Contact your local emergency management office for personalized assistance.
                </p>
              </div>
            </div>
            <Button asChild>
              <a href="/emergency-contacts">View Emergency Contacts</a>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SafetyGuidelines;
