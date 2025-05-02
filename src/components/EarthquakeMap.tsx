
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
      
      // Set URL based on filterType
      let baseUrl = 'https://earthquake.usgs.gov/earthquakes/map/';
      
      switch (filterType) {
        case 'continent':
          // Default view (world view)
          iframe.src = `${baseUrl}?extent=19.31114,-198.6914&extent=76.93037,-40.42969`;
          break;
        case 'magnitude':
          // URL for focusing on magnitude (set to show significant earthquakes)
          iframe.src = `${baseUrl}?extent=19.31114,-198.6914&extent=76.93037,-40.42969&list=false&map=false&search=false&settings=false&sort=newest&timeZone=utc&basemap=grayscale&feed=4.5_week`;
          break;
        case 'time':
          // URL for recent earthquakes
          iframe.src = `${baseUrl}?extent=19.31114,-198.6914&extent=76.93037,-40.42969&list=false&map=false&search=false&settings=false&sort=newest&timeZone=utc&feed=1.0_day`;
          break;
        default:
          iframe.src = baseUrl;
      }

      // Add the iframe to the container
      mapContainer.current?.appendChild(iframe);
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
    }

    // Cleanup
    return () => {
      const iframe = mapContainer.current?.querySelector('iframe');
      if (iframe) {
        iframe.onerror = null;
      }
    };
  }, [filterType, toast]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[500px] rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
};

export default EarthquakeMap;
