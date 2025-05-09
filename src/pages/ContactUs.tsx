
import React from "react";
import { Phone, Mail } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

const ContactUs = () => {
  return (
    <PageLayout>
      <PageBreadcrumbs items={[{ label: "Contact Us" }]} />
      
      <section className="bg-techtoniq-blue-light/30 py-12">
        <div className="container">
          <h1 className="mb-4 text-3xl font-bold text-techtoniq-earth-dark">Contact Us</h1>
          <p className="text-techtoniq-earth">
            Have questions about earthquakes or our services? Reach out to our team.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="container">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Google Form */}
            <div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">
                  Send us a Message
                </h2>
                
                <div className="w-full">
                  <iframe 
                    src="https://docs.google.com/forms/d/e/1FAIpQLSeacbJtB1A--tPqc4T7lxZQd6FsakQ4VCmTDniF2atx9HTPmw/viewform?embedded=true" 
                    width="100%" 
                    height="800px"
                    className="border-0 shadow-none rounded overflow-hidden"
                    title="Contact Form"
                    aria-label="Google Form: Contact Us"
                  >
                    Loading form...
                  </iframe>
                </div>
              </div>
            </div>
            
            {/* Contact Information */}
            <div className="flex flex-col gap-6">
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">
                  Contact Information
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-techtoniq-blue-light p-2">
                      <Phone className="h-5 w-5 text-techtoniq-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Emergency Contact Numbers</h3>
                      <ul className="mt-2 space-y-2 text-techtoniq-earth">
                        <li className="flex items-center gap-2">
                          <span className="text-sm font-medium">National Emergency Number:</span>
                          <span className="text-sm">112</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-sm font-medium">Earthquake Helpline Service:</span>
                          <span className="text-sm">1092</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-sm font-medium">NDRF Helpline:</span>
                          <span className="text-sm">011-24363260, 9711077372</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <div className="rounded-full bg-techtoniq-blue-light p-2">
                      <Mail className="h-5 w-5 text-techtoniq-blue" />
                    </div>
                    <div>
                      <h3 className="font-medium text-techtoniq-earth-dark">Official Email Addresses</h3>
                      <ul className="mt-2 space-y-2 text-techtoniq-earth">
                        <li className="text-sm">dresponse-nerc@gov.in</li>
                        <li className="text-sm">controlroom@ndma.gov.in</li>
                        <li className="text-sm">sdma-assam@gov.in</li>
                        <li className="text-sm">revsecy-hp@nic.in</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default ContactUs;
