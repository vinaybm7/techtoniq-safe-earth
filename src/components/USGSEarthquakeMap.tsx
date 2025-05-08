
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface USGSEarthquakeMapProps {
  width?: string;
  height?: string;
  timeRange?: 'day' | 'week' | 'month';
  minMagnitude?: number;
  defaultView?: 'iframe' | 'custom';
}

const USGSEarthquakeMap = ({
  width = '100%',
  height = '600px',
  timeRange = 'week',
  minMagnitude = 2.5,
  defaultView = 'iframe'
}: USGSEarthquakeMapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Setup the map iframe
    const createMapIframe = () => {
      setIsLoading(true);
      
      // Clear previous iframe if exists
      while (mapContainer.current?.firstChild) {
        mapContainer.current.removeChild(mapContainer.current.firstChild);
      }

      // Create a new iframe
      const iframe = document.createElement('iframe');
      
      // Set iframe attributes
      iframe.style.width = width;
      iframe.style.height = height;
      iframe.style.border = 'none';
      iframe.style.borderRadius = '0.5rem'; // 8px rounded corners
      iframe.allow = "fullscreen";

      // Set URL based on parameters
      let baseUrl = 'https://earthquake.usgs.gov/earthquakes/map/';
      let queryParams = `?magnitude=${minMagnitude}`;
      
      // Add time range parameter
      if (timeRange) {
        queryParams += `&time=${timeRange}`;
      }
      
      iframe.src = baseUrl + queryParams;
      console.log("Creating USGS Earthquake Map iframe with src:", iframe.src);

      // Add event handlers
      iframe.onload = () => {
        console.log("USGS Map iframe loaded successfully");
        setIsLoading(false);
        setMapError(null);
      };
      
      iframe.onerror = () => {
        console.error("Failed to load USGS earthquake map");
        setMapError("Failed to load USGS earthquake map");
        setIsLoading(false);
        toast({
          title: "Map Error",
          description: "Failed to load the USGS earthquake map. Please try again later.",
          variant: "destructive",
        });
      };
      
      // Add the iframe to the container
      mapContainer.current?.appendChild(iframe);
      
      // Backup loading timeout - in case onload doesn't fire
      setTimeout(() => {
        if (isLoading) {
          setIsLoading(false);
        }
      }, 5000);
    };

    // Create the initial iframe
    createMapIframe();

    // Set up auto-refresh every 5 minutes (300000ms)
    const refreshInterval = setInterval(() => {
      console.log("Auto-refreshing earthquake map");
      const iframe = mapContainer.current?.querySelector('iframe');
      if (iframe) {
        iframe.src = iframe.src;
      }
    }, 300000);

    // Cleanup
    return () => {
      clearInterval(refreshInterval);
      if (mapContainer.current) {
        const iframe = mapContainer.current.querySelector('iframe');
        if (iframe) {
          iframe.onload = null;
          iframe.onerror = null;
        }
      }
    };
  }, [width, height, timeRange, minMagnitude, defaultView, toast, isLoading]);

  return (
    <div className="relative" style={{ width, height }}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10 rounded-lg">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-techtoniq-blue" />
            <p className="mt-2 text-techtoniq-earth font-medium">Loading earthquake map...</p>
          </div>
        </div>
      )}
      
      {mapError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg">
          <div className="text-center p-4">
            <div className="bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <p className="text-red-800 font-medium">{mapError}</p>
            <button 
              className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
              onClick={() => {
                setIsLoading(true);
                setMapError(null);
                const iframe = mapContainer.current?.querySelector('iframe');
                if (iframe) {
                  iframe.src = iframe.src;
                }
              }}
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div 
        ref={mapContainer} 
        className="w-full h-full rounded-lg border shadow-inner"
        aria-label="USGS Earthquake Map"
      />
    </div>
  );
};

export default USGSEarthquakeMap;
