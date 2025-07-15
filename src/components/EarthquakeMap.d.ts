interface EarthquakeMapProps {
    earthquakes: {
        id: string;
        magnitude: number;
        location: string;
        date: string;
        depth: number;
        coordinates: [number, number];
    }[];
    filterType: 'continent' | 'magnitude' | 'time';
}
declare const EarthquakeMap: ({ earthquakes, filterType }: EarthquakeMapProps) => import("react/jsx-runtime").JSX.Element;
export default EarthquakeMap;
