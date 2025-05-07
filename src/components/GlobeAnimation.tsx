
import { useEffect, useRef, useState } from "react";
import createGlobe, { COBEOptions } from "cobe";
import { cn } from "@/lib/utils";

// Configure the globe with colors that match the website's theme
const GLOBE_CONFIG: COBEOptions = {
  width: 800,
  height: 800,
  onRender: () => {},
  devicePixelRatio: 2,
  phi: 0,
  theta: 0.3,
  dark: 0,
  diffuse: 0.4,
  mapSamples: 16000,
  mapBrightness: 1.2,
  baseColor: [45/255, 127/255, 249/255], // techtoniq-blue
  markerColor: [59/255, 191/255, 186/255], // techtoniq-teal
  glowColor: [230/255, 242/255, 255/255], // Light blue glow similar to previous globe
  markers: [
    // India
    { location: [20.5937, 78.9629], size: 0.1 }, // India
    { location: [28.7041, 77.1025], size: 0.05 }, // Delhi
    { location: [19.0760, 72.8777], size: 0.08 }, // Mumbai
    { location: [22.5726, 88.3639], size: 0.06 }, // Kolkata
    { location: [13.0827, 80.2707], size: 0.05 }, // Chennai
    
    // Major earthquake zones globally
    { location: [36.2048, 138.2529], size: 0.08 }, // Japan
    { location: [37.0902, -95.7129], size: 0.08 }, // USA
    { location: [35.8617, 104.1954], size: 0.07 }, // China
    { location: [-33.8688, 151.2093], size: 0.05 }, // Australia
    { location: [-14.2350, -51.9253], size: 0.07 }, // Brazil
    { location: [41.8719, 12.5674], size: 0.04 }, // Italy
    { location: [61.5240, 105.3188], size: 0.06 }, // Russia
    { location: [56.1304, -106.3468], size: 0.05 }, // Canada
    { location: [-35.6751, -71.5430], size: 0.09 }, // Chile - Pacific Ring of Fire
    { location: [-18.7669, -52.9202], size: 0.05 }, // Peru - Pacific Ring of Fire
    { location: [-0.7893, 113.9213], size: 0.08 }, // Indonesia - Pacific Ring of Fire
    
    // Recent major earthquake locations
    { location: [39.7837, 143.0820], size: 0.09 }, // Fukushima 2011
    { location: [30.4680, 103.2471], size: 0.07 }, // Sichuan 2008
    { location: [3.3165, 95.8541], size: 0.09 }, // Sumatra 2004
  ],
};

const GlobeAnimation = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pointerInteracting = useRef<number | null>(null);
  const pointerInteractionMovement = useRef(0);
  const [r, setR] = useState(0);
  let phi = 0;
  let width = 0;

  const updatePointerInteraction = (value: number | null) => {
    pointerInteracting.current = value;
    if (canvasRef.current) {
      canvasRef.current.style.cursor = value !== null ? "grabbing" : "grab";
    }
  };

  const updateMovement = (clientX: number) => {
    if (pointerInteracting.current !== null) {
      const delta = clientX - pointerInteracting.current;
      pointerInteractionMovement.current = delta;
      setR(delta / 200);
    }
  };

  useEffect(() => {
    try {
      if (!canvasRef.current) return;
      
      const onResize = () => {
        if (canvasRef.current) {
          width = canvasRef.current.offsetWidth;
        }
      };
      
      window.addEventListener("resize", onResize);
      onResize();
      
      const onRender = (state: Record<string, any>) => {
        if (pointerInteracting.current === null) {
          phi += 0.005;
        }
        state.phi = phi + r;
        state.width = width * 2;
        state.height = width * 2;
      };
      
      const globeConfig: COBEOptions = {
        ...GLOBE_CONFIG,
        width: width * 2,
        height: width * 2,
        onRender,
      };
      
      const globe = createGlobe(canvasRef.current, globeConfig);
      
      setTimeout(() => {
        if (canvasRef.current) {
          canvasRef.current.style.opacity = "1";
          setIsLoading(false);
        }
      }, 800);
      
      return () => {
        window.removeEventListener("resize", onResize);
        globe.destroy();
      };
    } catch (error) {
      console.error("Globe initialization error:", error);
      setHasError(true);
      setIsLoading(false);
    }
  }, [r]);

  return (
    <div className="globe-container relative w-full h-[500px] md:h-[600px] bg-transparent">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-techtoniq-blue border-t-transparent"></div>
          <p className="ml-2 text-techtoniq-earth">Loading globe...</p>
        </div>
      )}
      
      {hasError ? (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center p-4">
            <p className="text-techtoniq-earth-dark">Failed to load globe animation.</p>
            <button 
              className="mt-2 px-4 py-2 bg-techtoniq-blue text-white rounded hover:bg-techtoniq-blue-dark transition-colors"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        </div>
      ) : (
        <div className={cn("absolute inset-0 mx-auto aspect-[1/1] w-full max-w-[600px]")}>
          <canvas
            className={cn("size-full opacity-0 transition-opacity duration-500 [contain:layout_paint_size]")}
            ref={canvasRef}
            onPointerDown={(e) =>
              updatePointerInteraction(e.clientX - pointerInteractionMovement.current)
            }
            onPointerUp={() => updatePointerInteraction(null)}
            onPointerOut={() => updatePointerInteraction(null)}
            onMouseMove={(e) => updateMovement(e.clientX)}
            onTouchMove={(e) => e.touches[0] && updateMovement(e.touches[0].clientX)}
          />
        </div>
      )}
    </div>
  );
};

export default GlobeAnimation;
