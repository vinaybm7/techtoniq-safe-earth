interface EarthquakeCardProps {
    id: string;
    magnitude: number;
    location: string;
    date: string;
    depth: number;
    url?: string;
    coordinates?: [number, number];
}
declare const EarthquakeCard: ({ magnitude, location, date, depth, url, coordinates }: EarthquakeCardProps) => import("react/jsx-runtime").JSX.Element;
export default EarthquakeCard;
