
import React, { useState } from "react";
import { Phone, Mail, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import PageLayout from "@/components/PageLayout";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";

const ContactUs = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast({
      title: "Message Sent",
      description: "Thank you for your message. We'll get back to you soon!",
    });
    
    // Reset form
    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
    setIsSubmitting(false);
  };

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
            {/* Contact Form */}
            <div>
              <div className="rounded-lg border bg-white p-6 shadow-sm">
                <h2 className="mb-6 text-xl font-semibold text-techtoniq-earth-dark">
                  Send us a Message
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="name">Your Name</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      name="subject"
                      placeholder="What is this regarding?"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Your message here..."
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full bg-techtoniq-blue hover:bg-techtoniq-blue-dark"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
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
