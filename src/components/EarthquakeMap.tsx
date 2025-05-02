import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
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
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const { toast } = useToast();

  // Use a temporary public token - in production, this should be stored securely
  const mapboxToken = 'pk.eyJ1IjoiZGVtby1tYXBib3giLCJhIjoiY2xvemx5MGtqMHZobzJrcGR5ZDY5eG9wYyJ9.LwRnVCRG9e3q-bWX8LPIcQ';

  useEffect(() => {
    if (!mapboxToken) {
      toast({
        title: "Map Error",
        description: "Mapbox token is missing. Please configure your token.",
        variant: "destructive",
      });
      return;
    }

    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      projection: 'globe',
      zoom: 1.5,
      center: [0, 20],
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add atmosphere effect
    map.current.on('style.load', () => {
      if (map.current) {
        map.current.setFog({
          color: 'rgb(255, 255, 255)',
          'high-color': 'rgb(200, 200, 225)',
          'horizon-blend': 0.2,
        });
      }
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapboxToken, toast]);

  // Update markers when earthquakes data changes
  useEffect(() => {
    if (!map.current || !earthquakes.length) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Filter and sort earthquakes based on filterType
    let processedEarthquakes = [...earthquakes];
    
    if (filterType === 'magnitude') {
      // Sort by magnitude (highest first)
      processedEarthquakes.sort((a, b) => b.magnitude - a.magnitude);
    } else if (filterType === 'time') {
      // Sort by time (newest first)
      processedEarthquakes.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }
    // For continents - we use the original data as we'll filter visually by moving the map

    // Add markers for each earthquake
    processedEarthquakes.forEach(quake => {
      if (!map.current) return;
      
      const [longitude, latitude] = quake.coordinates;
      
      // Create custom marker element
      const el = document.createElement('div');
      el.className = 'earthquake-marker';
      
      // Style based on magnitude
      const size = Math.max(6, Math.min(20, quake.magnitude * 4));
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;
      el.style.borderRadius = '50%';
      
      // Color based on magnitude
      let color;
      if (quake.magnitude >= 7) color = '#dc2626'; // red-600
      else if (quake.magnitude >= 5) color = '#ea580c'; // orange-600
      else if (quake.magnitude >= 3) color = '#eab308'; // yellow-500
      else color = '#16a34a'; // green-600
      
      el.style.backgroundColor = color;
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 0 0 1px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.2)';
      
      // Add popup with information
      const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
        <div style="font-family: sans-serif; padding: 8px;">
          <div style="font-weight: bold; margin-bottom: 4px;">M ${quake.magnitude.toFixed(1)} - ${quake.location}</div>
          <div style="font-size: 12px; color: #666;">
            <div>Date: ${quake.date}</div>
            <div>Depth: ${quake.depth} km</div>
          </div>
        </div>
      `);
      
      // Create marker
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .setPopup(popup)
        .addTo(map.current);
      
      markersRef.current.push(marker);
    });

    // Adjust map view for different filter types
    if (filterType === 'continent') {
      // Keep global view
      map.current.flyTo({
        center: [0, 20],
        zoom: 1.5,
        essential: true
      });
    } else if (processedEarthquakes.length > 0) {
      // Focus on the most significant earthquake based on filter
      const focusEarthquake = processedEarthquakes[0];
      map.current.flyTo({
        center: focusEarthquake.coordinates,
        zoom: 3,
        essential: true
      });
    }
  }, [earthquakes, filterType]);

  return (
    <div className="relative w-full h-full">
      <div 
        ref={mapContainer} 
        className="w-full h-full min-h-[500px] rounded-lg"
        style={{ width: '100%', height: '100%' }}
      />
      <style jsx global>{`
        .mapboxgl-ctrl-logo, .mapboxgl-ctrl-attrib {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default EarthquakeMap;
