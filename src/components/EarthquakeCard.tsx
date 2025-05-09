
import { Activity, Calendar, MapPin } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { Badge } from "./ui/badge";
import { format, parseISO } from "date-fns";

interface EarthquakeCardProps {
  id: string;
  magnitude: number;
  location: string;
  date: string;
  depth: number;
  url?: string;
  coordinates?: [number, number]; // Longitude, Latitude
}

const EarthquakeCard = ({ magnitude, location, date, depth, url, coordinates }: EarthquakeCardProps) => {
  // Determine color based on magnitude
  const getMagnitudeColor = (mag: number) => {
    if (mag >= 7) return "bg-red-600 hover:bg-red-700";
    if (mag >= 5) return "bg-techtoniq-alert hover:bg-techtoniq-alert-dark";
    if (mag >= 3) return "bg-techtoniq-warning hover:bg-techtoniq-warning-dark";
    return "bg-techtoniq-teal hover:bg-techtoniq-teal-dark";
  };

  // Format date in IST
  const formatDateInIST = (dateStr: string) => {
    try {
      // Try to parse the date string
      let date;
      
      // Check if it's already a properly formatted date
      if (dateStr.includes('GMT+5:30') || dateStr.includes('IST')) {
        return dateStr;
      }
      
      try {
        // Try parsing as ISO date first
        date = parseISO(dateStr);
      } catch (e) {
        // If that fails, try as regular date
        date = new Date(dateStr);
      }
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }
      
      // Format to Indian Standard Time
      return new Intl.DateTimeFormat('en-US', { 
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      }).format(date) + ' IST';
    } catch (error) {
      console.error("Date formatting error:", error, "for date:", dateStr);
      return dateStr; // Return original string if formatting fails
    }
  };

  // Format the local time based on earthquake coordinates
  const getLocalTime = () => {
    try {
      if (!coordinates) return null;
      
      // Convert coordinates to timezone estimation
      // This is a simplified approach - in a full implementation, we'd use a timezone API
      // based on lat/long coordinates, but for now we'll estimate based on longitude
      const [longitude] = coordinates;
      const hours = Math.round(longitude / 15); // Each 15 degrees is roughly 1 hour time difference
      
      const date = new Date();
      const utcHours = date.getUTCHours();
      const localHour = (utcHours + hours + 24) % 24; // Add 24 and mod 24 to handle negative values
      
      return `~${localHour}:${date.getUTCMinutes().toString().padStart(2, '0')} local time`;
    } catch (error) {
      return null;
    }
  };

  // Get local time string
  const localTime = getLocalTime();

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
                  <span>{formatDateInIST(date)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  <span>{depth} km depth</span>
                </div>
              </div>
              {localTime && (
                <div className="mt-1 text-xs text-techtoniq-teal-dark">
                  {localTime}
                </div>
              )}
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
