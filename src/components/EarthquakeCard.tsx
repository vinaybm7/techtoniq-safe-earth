import { Activity, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";

interface EarthquakeCardProps {
  id: string;
  magnitude: number;
  location: string;
  date: string;
  depth: number;
  url?: string;
}

const EarthquakeCard = ({ magnitude, location, date, depth, url }: EarthquakeCardProps) => {
  // Determine color based on magnitude
  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7) return "bg-red-600 hover:bg-red-700";
    if (mag >= 5) return "bg-techtoniq-alert hover:bg-techtoniq-alert-dark";
    if (mag >= 3) return "bg-techtoniq-warning hover:bg-techtoniq-warning-dark";
    return "bg-techtoniq-teal hover:bg-techtoniq-teal-dark";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <a href={url} target="_blank" rel="noopener noreferrer" className="block">
        <div className="relative bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="mb-1 font-medium">{location}</h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-techtoniq-earth">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{depth} km depth</span>
                </div>
              </div>
            </div>
            <Badge className={`flex h-10 w-10 items-center justify-center rounded-full text-lg ${getMagnitudeColor(magnitude)}`}>
              {magnitude.toFixed(1)}
            </Badge>
          </div>
          <div className="mt-4 flex items-center gap-2">
            <Activity className="h-4 w-4 text-techtoniq-earth" />
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div 
                className={`h-full ${getMagnitudeColor(magnitude)}`}
                style={{ width: `${Math.min(magnitude * 10, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
      </a>
    </Card>
  );
};

export default EarthquakeCard;
