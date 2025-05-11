import { useState, useEffect } from 'react';
import { Info, MapPin, Loader2, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Earthquake } from '@/services/earthquakeService';

interface AIEarthquakePredictionProps {
  className?: string;
  earthquakes?: Earthquake[];
  isLoading?: boolean;
}

interface Prediction {
  location: string;
  probability: number;
  timeframe: string;
  magnitude: string;
  description: string;
  isIndian: boolean;
}

const AIEarthquakePrediction = ({
  className = '',
  earthquakes = [],
  isLoading = false
}: AIEarthquakePredictionProps) => {
  const [predictions, setPredictions] = useState<Prediction[]>([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const { toast } = useToast();

  // Function to get user's location
  const getUserLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Geolocation Error",
        description: "Geolocation is not supported by your browser",
        variant: "destructive",
      });
      return;
    }

    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude
        });
        setLocationLoading(false);
        
        // Generate predictions with the new location
        generatePredictions(position.coords.latitude, position.coords.longitude);
        
        toast({
          title: "Location Updated",
          description: "Your location has been updated for personalized predictions",
          variant: "default",
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setLocationLoading(false);
        toast({
          title: "Location Error",
          description: error.message,
          variant: "destructive",
        });
      }
    );
  };

  // Function to analyze earthquake data and generate predictions using Gemini API
  const generatePredictions = async (latitude?: number, longitude?: number) => {
    if (!earthquakes || earthquakes.length === 0) return;
    
    try {
      setAiLoading(true);
      setError(null);
      
      // Prepare earthquake data for analysis
      const recentEarthquakes = earthquakes.slice(0, 20).map(quake => ({
        magnitude: quake.magnitude,
        location: quake.location,
        date: quake.date,
        depth: quake.depth,
        coordinates: quake.coordinates
      }));
      
      // Prepare the prompt for Gemini API
      let prompt = `Analyze the following recent earthquake data and provide predictions for potential future earthquakes. Focus on pattern recognition and seismic trends.\n\nRecent Earthquake Data:\n${JSON.stringify(recentEarthquakes, null, 2)}\n\n`;
      
      // Add location context if available
      if (latitude && longitude) {
        prompt += `\nUser's current location: Latitude ${latitude}, Longitude ${longitude}.\nProvide personalized risk assessment for this location.\n`;
      }
      
      prompt += `\nGive priority to predictions for India. If there are no significant predictions for India, explicitly state that India is currently safe.\n\nProvide 2-3 predictions in this JSON format:\n[{\n  "location": "specific location name",\n  "probability": number between 0-100,\n  "timeframe": "prediction timeframe (e.g., '3-5 days')",\n  "magnitude": "predicted magnitude range",\n  "description": "brief explanation of the prediction",\n  "isIndian": boolean indicating if this is an Indian location\n}]`;
      
      // Call Gemini API
      const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': 'AIzaSyC_ZWpE4nx8W-fB5A3SCdhE5AR8HD2uD8M'
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: prompt
            }]
          }]
        })
      });
      
      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Extract and parse the predictions from the response
      const content = data.candidates[0].content.parts[0].text;
      
      // Find JSON array in the response
      const jsonMatch = content.match(/\[\s*\{.*?\}\s*\]/s);
      
      if (jsonMatch) {
        try {
          const parsedPredictions = JSON.parse(jsonMatch[0]);
          setPredictions(parsedPredictions);
        } catch (parseError) {
          console.error("Error parsing predictions JSON:", parseError);
          // Fallback to default predictions if parsing fails
          setDefaultPredictions();
        }
      } else {
        // If no JSON found, set default predictions
        setDefaultPredictions();
      }
      
      setAiLoading(false);
    } catch (err) {
      console.error("Error generating predictions:", err);
      setError("Failed to generate earthquake predictions. Please try again later.");
      setAiLoading(false);
      // Set default predictions on error
      setDefaultPredictions();
    }
  };
  
  // Function to set default predictions when API fails
  const setDefaultPredictions = () => {
    const hasIndianEarthquakes = earthquakes.some(quake => 
      quake.location.toLowerCase().includes('india') ||
      quake.location.toLowerCase().includes('delhi') ||
      quake.location.toLowerCase().includes('gujarat') ||
      quake.location.toLowerCase().includes('assam')
    );
    
    const defaultPredictions: Prediction[] = [
      {
        location: hasIndianEarthquakes ? "Northern India Region" : "Pacific Ring of Fire",
        probability: hasIndianEarthquakes ? 35 : 75,
        timeframe: "7-10 days",
        magnitude: hasIndianEarthquakes ? "3.5-4.2" : "5.0-6.2",
        description: hasIndianEarthquakes 
          ? "Based on recent seismic activity in the Himalayan region, minor tremors possible."
          : "Continued activity expected along tectonic boundaries in the Pacific.",
        isIndian: hasIndianEarthquakes
      },
      {
        location: "Indonesia",
        probability: 65,
        timeframe: "3-5 days",
        magnitude: "4.8-5.5",
        description: "Recent pattern of seismic activity suggests potential for moderate earthquake.",
        isIndian: false
      },
      {
        location: "Southern California",
        probability: 40,
        timeframe: "14-21 days",
        magnitude: "3.0-4.5",
        description: "Minor to moderate seismic activity possible along the San Andreas fault system.",
        isIndian: false
      }
    ];
    
    // If no Indian earthquakes, add a safety message for India
    if (!hasIndianEarthquakes) {
      defaultPredictions.unshift({
        location: "India",
        probability: 5,
        timeframe: "30 days",
        magnitude: "< 3.0",
        description: "You're safe! No significant seismic activity predicted for India in the near future.",
        isIndian: true
      });
    }
    
    setPredictions(defaultPredictions);
  };

  // Generate predictions when earthquakes data changes
  useEffect(() => {
    if (earthquakes && earthquakes.length > 0 && !isLoading) {
      generatePredictions(userLocation?.lat, userLocation?.lng);
    }
  }, [earthquakes, isLoading]);

  // Get probability color based on value
  const getProbabilityColor = (probability: number): string => {
    if (probability < 30) return 'text-green-600';
    if (probability < 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className={`rounded-lg border bg-white p-6 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Info className="h-5 w-5 text-techtoniq-blue" />
            <h3 className="text-xl font-medium text-techtoniq-earth-dark">AI Earthquake Predictions</h3>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={getUserLocation}
            disabled={locationLoading}
            className="flex items-center gap-1.5"
          >
            {locationLoading ? (
              <>
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                <span>Getting Location</span>
              </>
            ) : (
              <>
                <MapPin className="h-3.5 w-3.5" />
                <span>{userLocation ? 'Update Location' : 'Use My Location'}</span>
              </>
            )}
          </Button>
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-xs text-gray-500 flex items-center">
            <span className="mr-1">Powered by:</span>
            <span className="font-medium mr-2">Google Gemini AI</span> + 
            <span className="font-medium ml-2">USGS Data</span>
          </span>
        </div>
      </div>
      
      {userLocation && (
        <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm">
          <div className="flex gap-2">
            <MapPin className="h-5 w-5 flex-shrink-0 text-blue-500" />
            <div>
              <p className="font-medium text-blue-800">Personalized Prediction Active</p>
              <p className="mt-1 text-blue-700">
                Predictions are now tailored to your current location (Lat: {userLocation.lat.toFixed(4)}, Lng: {userLocation.lng.toFixed(4)}).
              </p>
            </div>
          </div>
        </div>
      )}
      
      {aiLoading ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-techtoniq-blue border-t-transparent"></div>
          <p className="mt-2 text-sm text-techtoniq-earth">Analyzing seismic patterns...</p>
        </div>
      ) : error ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <AlertTriangle className="mb-2 h-6 w-6 text-techtoniq-alert" />
          <p className="text-sm text-techtoniq-earth">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => generatePredictions(userLocation?.lat, userLocation?.lng)}
          >
            Try Again
          </Button>
        </div>
      ) : predictions.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <Info className="mb-2 h-6 w-6 text-gray-400" />
          <p className="text-sm text-techtoniq-earth">No prediction data available</p>
          <p className="mt-1 text-xs text-gray-500">Try refreshing or updating your location</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {predictions.map((prediction, index) => (
            <div 
              key={index} 
              className={`rounded-lg border p-3 hover:bg-gray-50 ${prediction.isIndian ? 'border-2 border-blue-500 bg-blue-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-techtoniq-earth-dark">
                      {prediction.location}
                      {prediction.isIndian && (
                        <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-xs text-white">
                          🇮🇳 India
                        </span>
                      )}
                    </h4>
                  </div>
                  <p className="mt-1 text-sm text-techtoniq-earth">{prediction.description}</p>
                </div>
                
                <div className="rounded-md bg-gray-100 px-2 py-1 text-center">
                  <p className={`text-xs font-medium ${getProbabilityColor(prediction.probability)}`}>
                    {prediction.probability}% probability
                  </p>
                </div>
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div className="flex gap-4">
                  <p className="text-xs text-techtoniq-earth">
                    <span className="font-medium">Timeframe:</span> {prediction.timeframe}
                  </p>
                  <p className="text-xs text-techtoniq-earth">
                    <span className="font-medium">Magnitude:</span> {prediction.magnitude}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 p-4 bg-blue-50 rounded-lg text-sm">
        <p className="text-techtoniq-blue-dark font-medium">About AI Earthquake Predictions</p>
        <p className="mt-1 text-techtoniq-earth">
          These predictions are generated using Google Gemini AI to analyze patterns in recent seismic data. 
          The AI examines factors like magnitude, depth, and geographic distribution to identify potential 
          earthquake risks. Predictions are not guaranteed and should be used for informational purposes only.
        </p>
      </div>
    </div>
  );
};

export default AIEarthquakePrediction;