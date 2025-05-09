
import { AlertTriangle, ArrowRight, Book, ChevronLeft, ChevronRight, Clock, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import DataOverview from "@/components/DataOverview";
import EarthquakeCard from "@/components/EarthquakeCard";
import GlobeAnimation from "@/components/GlobeAnimation";

const Index = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      title: "Real-Time Earthquake Data",
      content: "Stay updated with the latest earthquake information from around the world.",
      icon: <Clock className="h-6 w-6" />,
      link: "/real-time-data",
    },
    {
      title: "Comprehensive Safety Guidelines",
      content: "Learn what to do before, during, and after an earthquake to keep yourself and your loved ones safe.",
      icon: <Shield className="h-6 w-6" />,
      link: "/safety-guidelines",
    },
    {
      title: "Educational Resources",
      content: "Access a wealth of information to better understand earthquakes and their impacts.",
      icon: <Book className="h-6 w-6" />,
      link: "/educational-materials",
    },
  ];

  const recentEarthquakes = [
    {
      id: "eq-chile-1",
      magnitude: 6.7,
      location: "Santiago, Chile",
      date: "Today, 04:32 AM",
      depth: 35,
    },
    {
      id: "eq-japan-1",
      magnitude: 5.1,
      location: "Tokyo, Japan",
      date: "Yesterday, 11:47 PM",
      depth: 22,
    },
    {
      id: "eq-alaska-1",
      magnitude: 4.2,
      location: "Alaska, USA",
      date: "April 15, 2025, 08:12 AM",
      depth: 18,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <PageLayout>
      <section className="relative overflow-hidden bg-gradient-to-b from-techtoniq-blue-light to-white py-16">
        <div className="container relative z-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="mx-auto max-w-xl md:mx-0 text-center md:text-left">
              <div className="mb-6 inline-flex animate-pulse-slow items-center rounded-full bg-techtoniq-blue-light px-4 py-1.5">
                <AlertTriangle className="mr-2 h-4 w-4 text-techtoniq-blue" />
                <span className="text-sm font-medium text-techtoniq-blue">Earthquake Preparedness & Safety</span>
              </div>
              <h1 className="mb-6 text-4xl font-bold tracking-tight text-techtoniq-earth-dark sm:text-5xl md:text-6xl">
                Be Prepared, Stay <span className="text-techtoniq-blue">Safe</span>
              </h1>
              <p className="mb-8 text-xl text-techtoniq-earth">
                Techtoniq provides you with the tools and knowledge to prepare for earthquakes,
                stay informed during seismic events, and safely recover afterward.
              </p>
              <div className="flex flex-col items-center md:items-start justify-start gap-4 sm:flex-row">
                <Button asChild className="bg-techtoniq-blue hover:bg-techtoniq-blue-dark">
                  <Link to="/real-time-data">
                    View Real-Time Data
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/safety-guidelines">
                    Safety Guidelines
                  </Link>
                </Button>
              </div>
            </div>
            <div className="hidden md:block relative w-full h-full max-h-[500px] mt-8 md:mt-0">
              <GlobeAnimation />
            </div>
          </div>
        </div>
        
        <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-techtoniq-teal/10"></div>
        <div className="absolute -right-10 top-20 h-32 w-32 rounded-full bg-techtoniq-blue/10"></div>
      </section>

      <section className="py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-techtoniq-earth-dark md:text-3xl">
              Stay Informed with Real-Time Data
            </h2>
            <p className="mt-2 text-techtoniq-earth">
              Access the most current earthquake information from around the globe
            </p>
          </div>
          
          <DataOverview />
          
          <div className="mt-12">
            <div className="mb-6 flex items-center justify-between">
              <h3 className="text-xl font-medium text-techtoniq-earth-dark">Recent Earthquakes</h3>
              <Link 
                to="/real-time-data" 
                className="flex items-center text-sm font-medium text-techtoniq-blue hover:text-techtoniq-blue-dark"
              >
                View all <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentEarthquakes.map((quake, index) => (
                <EarthquakeCard key={index} {...quake} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Educational resources section with updated images */}
      <section className="bg-techtoniq-blue-light/20 py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-techtoniq-earth-dark md:text-3xl">
              Educational Resources
            </h2>
            <p className="mt-2 text-techtoniq-earth">
              Learn about earthquakes and how they impact our world
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* What is an Earthquake? - Using the same image as Educational Materials page */}
            <a 
              href="https://medium.com/@vnyone7/what-is-an-earthquake-understanding-earths-powerful-tremors-08ae3bb9de79" 
              target="_blank" 
              rel="noopener noreferrer"
              className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `url('/lovable-uploads/bf80de60-d79c-420f-b661-12d312539c86.png')`,
                  }}
                >
                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="absolute bottom-0 p-4 text-white z-10">
                  <h3 className="text-xl font-bold drop-shadow-md">What is an Earthquake?</h3>
                  <p className="mt-2 text-sm text-white drop-shadow-md">Understanding Earth's powerful tremors</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-techtoniq-earth">
                  Learn about the causes of earthquakes, plate tectonics, and how the Earth's movement creates seismic activity.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-techtoniq-blue">
                  Read article <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </a>

            {/* Measuring Earthquakes - Using the same image as Educational Materials page */}
            <a 
              href="https://medium.com/@vnyone7/what-is-an-earthquake-understanding-earths-powerful-tremors-08ae3bb9de79" 
              target="_blank"
              rel="noopener noreferrer" 
              className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `url('/lovable-uploads/3b831d98-c9de-4126-8474-12863aa56995.png')`,
                  }}
                >
                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="absolute bottom-0 p-4 text-white z-10">
                  <h3 className="text-xl font-bold drop-shadow-md">Measuring Earthquakes</h3>
                  <p className="mt-2 text-sm text-white drop-shadow-md">Scales and monitoring techniques</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-techtoniq-earth">
                  Discover how scientists measure earthquake magnitude and intensity, and the technology used to monitor seismic activity.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-techtoniq-blue">
                  Read article <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </a>

            {/* Understanding Seismic Waves - Using the same image as Educational Materials page */}
            <a 
              href="https://medium.com/@vnyone7/understanding-seismic-waves-earths-hidden-messengers-d58072c7a5b2" 
              target="_blank"
              rel="noopener noreferrer" 
              className="group block overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg"
            >
              <div className="relative h-48 overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                  style={{ 
                    backgroundImage: `url('/lovable-uploads/5b120487-1512-4bca-8fc3-0f4a43fefa1c.png')`,
                  }}
                >
                  {/* Dark overlay for better text visibility */}
                  <div className="absolute inset-0 bg-black bg-opacity-50"></div>
                </div>
                <div className="absolute bottom-0 p-4 text-white z-10">
                  <h3 className="text-xl font-bold drop-shadow-md">Understanding Seismic Waves</h3>
                  <p className="mt-2 text-sm text-white drop-shadow-md">Earth's hidden messengers</p>
                </div>
              </div>
              <div className="p-4">
                <p className="text-techtoniq-earth">
                  Learn about P-waves, S-waves, and surface waves, and how they travel through the Earth during an earthquake.
                </p>
                <div className="mt-4 flex items-center text-sm font-medium text-techtoniq-blue">
                  Read article <ArrowRight className="ml-1 h-4 w-4" />
                </div>
              </div>
            </a>
          </div>
        </div>
      </section>

      <section className="bg-techtoniq-teal-light/30 py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-techtoniq-earth-dark md:text-3xl">
              Learn How to Prepare
            </h2>
            <p className="mt-2 text-techtoniq-earth">
              Discover essential information to prepare for earthquake emergencies
            </p>
          </div>

          <div className="relative overflow-hidden rounded-xl bg-white shadow-md">
            <div className="relative h-80 overflow-hidden">
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 flex flex-col items-center justify-center p-8 text-center transition-opacity duration-500 ${
                    index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <div className="mb-4 rounded-full bg-techtoniq-blue-light p-3">
                    {slide.icon}
                  </div>
                  <h3 className="mb-2 text-xl font-medium text-techtoniq-earth-dark">{slide.title}</h3>
                  <p className="mb-6 max-w-md text-techtoniq-earth">{slide.content}</p>
                  <Button asChild>
                    <Link to={slide.link}>
                      Learn More
                    </Link>
                  </Button>
                </div>
              ))}

              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 shadow-md hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <div className="flex justify-center space-x-2 p-4">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 w-8 rounded-full transition-colors ${
                    index === currentSlide ? "bg-techtoniq-blue" : "bg-gray-200"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-2xl font-bold text-techtoniq-earth-dark md:text-3xl">
              Get Started with Techtoniq
            </h2>
            <p className="mt-4 text-techtoniq-earth">
              Take the first steps to better protect yourself and your loved ones from earthquake hazards
            </p>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-techtoniq-blue-light">
                  <AlertTriangle className="h-6 w-6 text-techtoniq-blue" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-techtoniq-earth-dark">Monitor Activity</h3>
                <p className="mb-4 text-sm text-techtoniq-earth">
                  Stay updated with the latest earthquake data and alerts in your area.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/real-time-data">View Data</Link>
                </Button>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-techtoniq-teal-light">
                  <Shield className="h-6 w-6 text-techtoniq-teal" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-techtoniq-earth-dark">Know What to Do</h3>
                <p className="mb-4 text-sm text-techtoniq-earth">
                  Learn the proper safety procedures for before, during, and after an earthquake.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/safety-guidelines">Safety Guide</Link>
                </Button>
              </div>
              
              <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-techtoniq-warning-light">
                  <Book className="h-6 w-6 text-techtoniq-warning" />
                </div>
                <h3 className="mb-2 text-lg font-medium text-techtoniq-earth-dark">Educate Yourself</h3>
                <p className="mb-4 text-sm text-techtoniq-earth">
                  Access educational resources to understand earthquakes and preparedness.
                </p>
                <Button asChild variant="outline" size="sm" className="w-full">
                  <Link to="/educational-materials">Learn More</Link>
                </Button>
              </div>
            </div>
            <Button asChild className="mt-10 bg-techtoniq-blue hover:bg-techtoniq-blue-dark">
              <Link to="/educational-materials">
                Explore All Resources
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default Index;
