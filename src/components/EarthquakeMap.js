import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Loader2, ZoomIn, ZoomOut, Crosshair } from 'lucide-react';
const EarthquakeMap = ({ earthquakes, filterType }) => {
    const mapContainer = useRef(null);
    const { toast } = useToast();
    const [isLoading, setIsLoading] = useState(true);
    const [mapError, setMapError] = useState(null);
    const [iframeInitialized, setIframeInitialized] = useState(false);
    useEffect(() => {
        if (!mapContainer.current)
            return;
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
            iframe.width = '100%';
            iframe.height = '100%';
            iframe.style.border = 'none';
            iframe.style.borderRadius = '0.5rem'; // 8px rounded corners
            iframe.allow = "fullscreen";
            // Set URL based on filterType
            let baseUrl = 'https://earthquake.usgs.gov/earthquakes/map/';
            let queryParams = '';
            // Add filter parameters based on the selected filter type
            switch (filterType) {
                case 'continent':
                    // Focus on India and surrounding regions with magnitude filter
                    queryParams = '?extent=6,68&extent=37,97&magnitude=2.5';
                    break;
                case 'magnitude':
                    // URL for focusing on magnitude
                    queryParams = '?list=true&sort=magnitude&magnitude=2.5';
                    break;
                case 'time':
                    // URL for recent earthquakes
                    queryParams = '?list=true&sort=newest&magnitude=2.5';
                    break;
                default:
                    queryParams = '?magnitude=2.5';
            }
            // Explicitly set the source URL with full parameters
            iframe.src = baseUrl + queryParams;
            console.log("Creating USGS Earthquake Map iframe with src:", iframe.src);
            // Add event handlers
            iframe.onload = () => {
                console.log("Map iframe loaded successfully");
                setIsLoading(false);
                setMapError(null);
                setIframeInitialized(true);
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
            // Instead of directly setting the sandbox attribute, use setAttribute
            iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox');
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
        // Cleanup
        return () => {
            if (mapContainer.current) {
                const iframe = mapContainer.current.querySelector('iframe');
                if (iframe) {
                    iframe.onload = null;
                    iframe.onerror = null;
                }
            }
        };
    }, [filterType, toast, isLoading]);
    // Create a function to reload the iframe
    const reloadMap = () => {
        setIsLoading(true);
        setMapError(null);
        if (mapContainer.current) {
            const iframe = mapContainer.current.querySelector('iframe');
            if (iframe) {
                // Refresh the iframe by reloading its source
                iframe.src = iframe.src;
            }
        }
    };
    return (_jsxs("div", { className: "relative w-full h-full", children: [isLoading && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-70 z-10 rounded-lg", children: _jsxs("div", { className: "text-center", children: [_jsx(Loader2, { className: "h-8 w-8 animate-spin mx-auto text-techtoniq-blue" }), _jsx("p", { className: "mt-2 text-techtoniq-earth font-medium", children: "Loading earthquake map..." })] }) })), mapError && (_jsx("div", { className: "absolute inset-0 flex items-center justify-center bg-red-50 rounded-lg", children: _jsxs("div", { className: "text-center p-4", children: [_jsx("div", { className: "bg-red-100 rounded-full h-12 w-12 flex items-center justify-center mx-auto mb-3", children: _jsx("svg", { className: "h-6 w-6 text-red-600", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" }) }) }), _jsx("p", { className: "text-red-800 font-medium", children: mapError }), _jsx("button", { className: "mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors", onClick: reloadMap, children: "Retry" })] }) })), _jsx("div", { ref: mapContainer, className: "w-full h-full min-h-[500px] rounded-lg border shadow-inner", "aria-label": "USGS Earthquake Map" }), _jsxs("div", { className: "absolute top-3 right-3 flex flex-col gap-2 z-10", children: [_jsxs("div", { className: "bg-white rounded shadow p-1", children: [_jsx("button", { className: "p-1 hover:bg-gray-100 rounded", title: "Zoom In", onClick: () => {
                                    const iframe = mapContainer.current?.querySelector('iframe');
                                    if (iframe && iframe.contentWindow) {
                                        try {
                                            // Try to send a message to the iframe to zoom in
                                            iframe.contentWindow.postMessage({ action: 'zoomIn' }, 'https://earthquake.usgs.gov');
                                        }
                                        catch (e) {
                                            console.error("Could not interact with map", e);
                                        }
                                    }
                                }, children: _jsx(ZoomIn, { className: "h-5 w-5 text-gray-600" }) }), _jsx("button", { className: "p-1 hover:bg-gray-100 rounded", title: "Zoom Out", onClick: () => {
                                    const iframe = mapContainer.current?.querySelector('iframe');
                                    if (iframe && iframe.contentWindow) {
                                        try {
                                            iframe.contentWindow.postMessage({ action: 'zoomOut' }, 'https://earthquake.usgs.gov');
                                        }
                                        catch (e) {
                                            console.error("Could not interact with map", e);
                                        }
                                    }
                                }, children: _jsx(ZoomOut, { className: "h-5 w-5 text-gray-600" }) })] }), _jsx("div", { className: "bg-white rounded shadow p-1", children: _jsx("button", { className: "p-1 hover:bg-gray-100 rounded", title: "Reset View", onClick: reloadMap, children: _jsx(Crosshair, { className: "h-5 w-5 text-gray-600" }) }) })] })] }));
};
export default EarthquakeMap;
