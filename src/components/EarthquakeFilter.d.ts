export interface FilterValues {
    minMagnitude: number;
    maxMagnitude: number;
    timeframe: 'all' | 'today' | 'week' | 'month';
    region: string;
    sortBy: 'latest' | 'magnitude' | 'location';
}
interface EarthquakeFilterProps {
    onFilterChange: (filters: FilterValues) => void;
    displayLimit: number;
    onDisplayLimitChange: (limit: number) => void;
}
declare const EarthquakeFilter: ({ onFilterChange, displayLimit, onDisplayLimitChange }: EarthquakeFilterProps) => import("react/jsx-runtime").JSX.Element;
export default EarthquakeFilter;
