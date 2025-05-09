
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Earthquake } from '@/services/earthquakeService';

interface USGSEarthquakeMapDataProps {
  width?: string;
  height?: string;
  earthquakes?: Earthquake[];
  isLoading?: boolean;
}

const USGSEarthquakeMapData = ({
  width = '100%',
  height = '600px',
  earthquakes = [],
  isLoading = false
}: USGSEarthquakeMapDataProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { toast } = useToast();
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapLoading, setMapLoading] = useState(true);

  // Function to get marker color based on magnitude
  const getMarkerColor = (magnitude: number): string => {
    if (magnitude < 2) return '#2ecc71'; // green for small earthquakes
    if (magnitude < 4) return '#f1c40f'; // yellow for moderate
    if (magnitude < 6) return '#e67e22'; // orange for strong
    return '#e74c3c'; // red for major earthquakes
  };

  // Function to get marker size based on magnitude
  const getMarkerSize = (magnitude: number): number => {
    return Math.max(6, Math.min(20, magnitude * 3));
  };

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize the map only once
    if (!map.current) {
      try {
        // You would typically get this from an environment variable
        mapboxgl.accessToken = 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4M29iazA2Z2gycXA4N2pmbDZmangifQ.-g_vE53SD2WrJ6tFX7QHmA'; // Public token for examples

        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/dark-v11', // Dark style works well for earthquake visualization
          zoom: 1.5,
          center: [0, 20],
          projection: 'globe'
        });

        map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
        map.current.scrollZoom.enable();

        // Add atmosphere for globe view
        map.current.on('style.load', () => {
          map.current?.setFog({
            color: 'rgb(186, 210, 235)',
            'high-color': 'rgb(36, 92, 223)',
            'horizon-blend': 0.02,
            'space-color': 'rgb(11, 11, 25)',
            'star-intensity': 0.6
          });

          setMapLoading(false);
        });

        // Add popup for when map is clicked on empty space
        map.current.on('click', (e) => {
          // If click is on a marker, the marker's popup will show instead
          if (e.originalEvent.defaultPrevented) return;
          
          new mapboxgl.Popup()
            .setLngLat(e.lngLat)
            .setHTML(`<strong>Coordinates</strong><br>Lat: ${e.lngLat.lat.toFixed(4)}<br>Lng: ${e.lngLat.lng.toFixed(4)}`)
            .addTo(map.current as mapboxgl.Map);
        });

      } catch (error) {
        console.error("Error initializing map:", error);
        setMapError("Failed to initialize the earthquake map.");
        setMapLoading(false);
        toast({
          title: "Map Error",
          description: "Failed to initialize the earthquake map. Please try again later.",
          variant: "destructive",
        });
      }
    }

    // Update markers when earthquakes data changes
    if (map.current && earthquakes && earthquakes.length > 0) {
      // Remove existing markers
      const existingMarkers = document.querySelectorAll('.earthquake-marker');
      existingMarkers.forEach(marker => marker.remove());

      // Add new markers
      earthquakes.forEach(earthquake => {
        if (!map.current) return;
        
        try {
          const [longitude, latitude] = earthquake.coordinates;
          
          // Create marker element
          const el = document.createElement('div');
          el.className = 'earthquake-marker';
          const size = getMarkerSize(earthquake.magnitude);
          const color = getMarkerColor(earthquake.magnitude);
          
          el.style.width = `${size}px`;
          el.style.height = `${size}px`;
          el.style.borderRadius = '50%';
          el.style.backgroundColor = color;
          el.style.opacity = '0.8';
          el.style.border = '2px solid rgba(255, 255, 255, 0.5)';
          el.style.boxShadow = '0 0 8px rgba(0, 0, 0, 0.3)';
          el.style.cursor = 'pointer';
          
          // Create popup
          const popup = new mapboxgl.Popup({ offset: 25 })
            .setHTML(`
              <div style="padding: 6px;">
                <h3 style="margin: 0 0 8px; font-weight: bold;">${earthquake.magnitude.toFixed(1)} Magnitude</h3>
                <p style="margin: 0 0 4px;"><strong>Location:</strong> ${earthquake.location}</p>
                <p style="margin: 0 0 4px;"><strong>Depth:</strong> ${earthquake.depth}km</p>
                <p style="margin: 0 0 4px;"><strong>Date:</strong> ${earthquake.date}</p>
                ${earthquake.tsunami ? '<p style="margin: 0; color: #e74c3c;"><strong>Tsunami Warning</strong></p>' : ''}
                <a href="${earthquake.url}" target="_blank" style="display: block; margin-top: 8px; color: #3498db;">View Details</a>
              </div>
            `);
          
          // Add marker to map
          new mapboxgl.Marker(el)
            .setLngLat([longitude, latitude])
            .setPopup(popup)
            .addTo(map.current);
            
        } catch (error) {
          console.error("Error adding earthquake marker:", error);
        }
      });

      setMapLoading(false);
    }

    // Cleanup
    return () => {
      // Do not destroy the map on component unmount, just clean up listeners
      if (map.current) {
        // Clean up any event listeners if needed
      }
    };
  }, [earthquakes, toast]);

  return (
    <div className="relative" style={{ width, height }}>
      {(mapLoading || isLoading) && (
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
                setMapLoading(true);
                setMapError(null);
                if (map.current) {
                  map.current.remove();
                  map.current = null;
                }
                // This will trigger the useEffect to reinitialize the map
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
      
      {!mapLoading && !isLoading && earthquakes.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 p-3 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#2ecc71] mr-1"></div>
              <span className="text-xs text-white">&lt;2</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#f1c40f] mr-1"></div>
              <span className="text-xs text-white">2-4</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#e67e22] mr-1"></div>
              <span className="text-xs text-white">4-6</span>
            </div>
            <div className="flex items-center">
              <div className="h-3 w-3 rounded-full bg-[#e74c3c] mr-1"></div>
              <span className="text-xs text-white">&gt;6</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default USGSEarthquakeMapData;
