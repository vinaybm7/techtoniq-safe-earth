
import { useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';

interface EarthquakeMapProps {
  earthquakes: {
    id: string;
    magnitude: number;
    location: string;
    date: string;
    depth: number;
    coordinates: [number, number]; // [longitude, latitude]
  }[];
  filterType: 'continent' | 'magnitude' | 'time';
}

const EarthquakeMap = ({ earthquakes, filterType }: EarthquakeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!mapContainer.current) return;

    // Setup the map iframe
    const createMapIframe = () => {
      // Clear previous iframe if exists
      while (mapContainer.current?.firstChild) {
        mapContainer.current.removeChild(mapContainer.current.firstChild);
      }

      // Create a new iframe
      const iframe = document.createElement('iframe');
      
      // Set iframe attributes
      iframe.width = '100%';
      iframe.height = '100%';
      iframe.style.border = 'none';
      iframe.style.borderRadius = '0.5rem'; // 8px rounded corners
      iframe.allow = "fullscreen";
      
      // Set URL based on filterType with focus on Indian region when possible
      const baseUrl = 'https://earthquake.usgs.gov/earthquakes/map/';
      
      switch (filterType) {
        case 'continent':
          // Focus on India and surrounding regions
          iframe.src = `${baseUrl}?extent=8.7547,60.4932&extent=40.1130,115.4932`;
          break;
        case 'magnitude':
          // URL for focusing on magnitude with India-centric view
          iframe.src = `${baseUrl}?extent=8.7547,60.4932&extent=40.1130,115.4932&list=false&sort=magnitude`;
          break;
        case 'time':
          // URL for recent earthquakes with India-centric view
          iframe.src = `${baseUrl}?extent=8.7547,60.4932&extent=40.1130,115.4932&list=false&sort=newest`;
          break;
        default:
          iframe.src = baseUrl;
      }

      // Add the iframe to the container
      mapContainer.current?.appendChild(iframe);
      
      // Log successful creation
      console.log("Creating USGS Earthquake Map iframe with src:", iframe.src);
    };

    // Create the initial iframe
    createMapIframe();

    // Add event listener for iframe load errors
    const handleError = () => {
      toast({
        title: "Map Error",
        description: "Failed to load the USGS earthquake map. Please try again later.",
        variant: "destructive",
      });
    };

    const iframe = mapContainer.current.querySelector('iframe');
    if (iframe) {
      iframe.onerror = handleError;
      
      // Add a load event listener to confirm successful loading
      iframe.onload = () => {
        console.log("USGS Earthquake Map loaded successfully");
      };
    }

    // Cleanup
    return () => {
      const iframe = mapContainer.current?.querySelector('iframe');
      if (iframe) {
        iframe.onerror = null;
        iframe.onload = null;
      }
    };
  }, [filterType, toast]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[500px] rounded-lg"
      />
    </div>
  );
};

export default EarthquakeMap;
