interface USGSEarthquakeMapProps {
    width?: string;
    height?: string;
    timeRange?: 'day' | 'week' | 'month';
    minMagnitude?: number;
    defaultView?: 'iframe' | 'custom';
}
declare const USGSEarthquakeMap: ({ width, height, timeRange, minMagnitude, defaultView }: USGSEarthquakeMapProps) => import("react/jsx-runtime").JSX.Element;
export default USGSEarthquakeMap;
