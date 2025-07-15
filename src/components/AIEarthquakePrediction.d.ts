import { Earthquake } from '@/services/earthquakeService';
interface AIEarthquakePredictionProps {
    className?: string;
    earthquakes?: Earthquake[];
    isLoading?: boolean;
}
declare const AIEarthquakePrediction: ({ className, earthquakes, isLoading }: AIEarthquakePredictionProps) => import("react/jsx-runtime").JSX.Element;
export default AIEarthquakePrediction;
