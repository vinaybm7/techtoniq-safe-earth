import 'mapbox-gl/dist/mapbox-gl.css';
import type { Earthquake } from '@/services/earthquakeService';
interface USGSEarthquakeMapDataProps {
    width?: string;
    height?: string;
    earthquakes?: Earthquake[];
    isLoading?: boolean;
}
declare const USGSEarthquakeMapData: ({ width, height, earthquakes, isLoading }: USGSEarthquakeMapDataProps) => import("react/jsx-runtime").JSX.Element;
export default USGSEarthquakeMapData;
