import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  MapPin, 
  Loader2, 
  Shield, 
  Home,
  ChevronLeft,
  Clock, 
  Navigation,
  AlertCircle,
  Map as MapIcon,
  ShieldCheck,
  BellRing,
  ChevronRight,
  Info
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  CardFooter 
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { GEMINI_API_KEY } from "@/config";

import { PredictionResponse } from '@/types';

import { getNearbyFaultLines } from '@/utils/geologicalData';

// Get nearby fault lines from USGS API
const getNearbyFaultLinesData = async (lat: number, lng: number) => {
  try {
    // Get fault lines within 200km radius
    const faultLines = await getNearbyFaultLines(lat, lng, 200);
    
    // If no fault lines found within 200km, try a wider search (500km)
    if (faultLines.length === 0) {
      const widerSearch = await getNearbyFaultLines(lat, lng, 500);
      return widerSearch;
    }
    
    return faultLines;
  } catch (error) {
    console.error('Error getting fault lines:', error);
    return [];
  }
};

// Generate prediction data based on location
const generatePredictionData = async (lat: number, lng: number): Promise<PredictionResponse> => {
  // Get real fault line data
  const nearbyFaultLines = await getNearbyFaultLinesData(lat, lng);
  
  // Calculate risk based on nearby fault lines and historical data
  let baseRisk = 0.2; // Base risk level
  
  // Increase risk based on proximity to fault lines
  if (nearbyFaultLines.length > 0) {
    const closestFault = nearbyFaultLines[0];
    if (closestFault.distance < 10) baseRisk = 0.7; // Very close to a fault
    else if (closestFault.distance < 50) baseRisk = 0.5; // Moderately close
    else if (closestFault.distance < 100) baseRisk = 0.3; // Somewhat close
  }
  
  const riskLevel = baseRisk > 0.6 ? 'high' : baseRisk > 0.3 ? 'medium' : 'low';
  
  return {
    riskLevel,
    probability: baseRisk,
    safetyScore: Math.max(30, Math.min(95, 100 - (baseRisk * 100))),
    lastUpdated: new Date().toISOString(),
    recommendations: generateRecommendations(riskLevel, nearbyFaultLines.length > 0),
    historicalData: {
      lastMonth: Math.round(baseRisk * 5),
      lastYear: Math.round(baseRisk * 50),
      averageMagnitude: {
        min: 2.0 + (baseRisk * 2),
        max: 4.0 + (baseRisk * 4),
        average: 3.0 + (baseRisk * 2)
      }
    },
    nearbyFaultLines
  };
};

// Generate recommendations based on risk level and fault proximity
const generateRecommendations = (riskLevel: string, hasNearbyFaults: boolean): string[] => {
  const recommendations: string[] = [
    'Secure heavy furniture to walls',
    'Prepare an emergency kit with supplies for 3 days',
    'Identify safe spots in each room (under sturdy furniture, against inside walls)'
  ];

  if (hasNearbyFaults) {
    recommendations.push(
      'Consider a professional structural assessment of your building'
    );
  }

  if (riskLevel === 'high') {
    recommendations.push(
      'Develop and practice an earthquake drill with your household',
      'Consider earthquake insurance if available in your area'
    );
  }

  return recommendations;
};

// Function to call Gemini API
async function getGeminiPrediction(lat: number, lng: number): Promise<PredictionResponse> {
  // First get real fault line data
  const nearbyFaultLines = await getNearbyFaultLinesData(lat, lng);
  const faultLineContext = nearbyFaultLines.length > 0
    ? `The location is near the following fault lines: ${nearbyFaultLines.map(f => `${f.name} (${f.distance.toFixed(1)}km ${f.direction})`).join(', ')}. `
    : 'No known major fault lines were found nearby. ';
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    throw new Error('No valid Gemini API key found. Please contact support.');
  }
  try {
    const prompt = `Analyze the earthquake risk for location at ${lat}, ${lng}. ${faultLineContext}
    Provide a JSON response with the following structure:
    {
      "riskLevel": "low|medium|high",
      "probability": number (0-1),
      "recommendations": string[],
      "historicalData": {
        "lastMonth": number,
        "lastYear": number,
        "averageMagnitude": {
          "min": number,
          "max": number,
          "average": number
        }
      },
      "nearbyFaultLines": Array<{
        "name": string,
        "distance": number,
        "direction": string,
        "type": string,
        "coordinates": { "lat": number, "lng": number }
      }>,
      "safetyScore": number (0-100),
      "nextCheck": string (ISO date)
    }`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, topP: 0.8, topK: 40 },
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      throw new Error(`API request failed with status ${response.status}`);
    }
    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error('No content in Gemini API response.');
    }
    let jsonString = content;
    const jsonMatch = content.match(/```(?:json)?\n([\s\S]*?)\n```/);
    if (jsonMatch && jsonMatch[1]) {
      jsonString = jsonMatch[1];
    }
    const result = JSON.parse(jsonString);
    if (!result.riskLevel || !result.probability || !result.recommendations) {
      throw new Error('Invalid response structure from Gemini API.');
    }
    return result;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw new Error('Failed to load prediction from Gemini AI.');
  }
}

const MyLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Load prediction when location changes
  useEffect(() => {
    if (location) {
      loadPrediction(location.lat, location.lng);
    }
  }, [location]);
  
  const loadPrediction = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError('');
    try {
      console.log('Loading prediction for location:', { lat, lng });
      const response = await getGeminiPrediction(lat, lng);
      console.log('Prediction data:', response);
      setPrediction(response);
    } catch (err: any) {
      console.error('Error in loadPrediction:', err);
      setError(err.message || 'Failed to load prediction from Gemini AI.');
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return { 
          text: 'text-red-600', 
          bg: 'bg-red-50', 
          border: 'border-red-200',
          icon: <AlertTriangle className="h-5 w-5 text-red-600" />
        };
      case 'medium':
        return { 
          text: 'text-yellow-600', 
          bg: 'bg-yellow-50', 
          border: 'border-yellow-200',
          icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />
        };
      case 'low':
        return { 
          text: 'text-green-600', 
          bg: 'bg-green-50', 
          border: 'border-green-200',
          icon: <ShieldCheck className="h-5 w-5 text-green-600" />
        };
      default:
        return { 
          text: 'text-gray-600', 
          bg: 'bg-gray-50', 
          border: 'border-gray-200',
          icon: <AlertCircle className="h-5 w-5 text-gray-600" />
        };
    }
  };

  const getRiskLevelText = (level: string) => {
    switch (level) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Moderate Risk';
      case 'low':
        return 'Low Risk';
      default:
        return 'Unknown Risk';
    }
  };

  const getSafetyScoreColor = (score: number) => {
    if (score >= 75) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  const formatDistance = (km: number) => {
    return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)}km`;
  };
  
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUserLocation = () => {
    setIsLoading(true);
    setError(null);

    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser");
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        
        // In a real app, you would use a geocoding service here
        const mockAddress = `Approx. ${Math.abs(latitude).toFixed(4)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(4)}°${longitude >= 0 ? 'E' : 'W'}`;
        
        setLocation({ 
          lat: latitude, 
          lng: longitude,
          address: mockAddress
        });
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Unable to retrieve your location. Please ensure location services are enabled and try again.");
        setIsLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };



  // Handle view on map action
  const handleViewOnMap = () => {
    if (location) {
      const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
      window.open(url, '_blank');
    }
  };

  // Handle subscribe to alerts
  const handleSubscribe = () => {
    toast({
      title: 'Notifications enabled',
      description: 'You will receive alerts for this location.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-techtoniq-blue-light/5 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="mb-6">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/" className="flex items-center text-sm hover:text-techtoniq-blue transition-colors">
                    <Home className="h-4 w-4 mr-1.5" />
                    Home
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-techtoniq-blue font-medium">
                  My Location Safety
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          
          <Button 
            variant="ghost" 
            asChild 
            className="mt-4 pl-0 hover:bg-transparent hover:text-techtoniq-blue"
          >
            <Link to="/" className="flex items-center">
              <ChevronLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
          </Button>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-techtoniq-earth-dark mb-4">
              <MapPin className="inline-block mr-3 h-10 w-10 text-techtoniq-blue" />
              My Location Safety
            </h1>
            <p className="text-lg text-techtoniq-earth max-w-2xl mx-auto">
              Get personalized earthquake risk assessment and safety recommendations for your current location.
            </p>
          </div>

          {/* Location Card */}
          <Card className="mb-8 overflow-hidden border-0 shadow-lg">
            <div className="md:flex">
              <div className="p-6 md:p-8 md:border-r border-gray-100 flex-1">
                <div className="flex items-start">
                  <div className="p-3 rounded-full bg-techtoniq-blue/10 mr-4">
                    <Navigation className="h-6 w-6 text-techtoniq-blue" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-techtoniq-earth-dark mb-1">
                      {location ? location.address : 'Your Current Location'}
                    </h2>
                    {location ? (
                      <p className="text-sm text-techtoniq-earth">
                        {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                      </p>
                    ) : (
                      <p className="text-sm text-techtoniq-earth">
                        Enable location services to see your current position
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="p-6 md:p-8 bg-techtoniq-blue/5 flex items-center justify-center">
                <Button 
                  onClick={getUserLocation}
                  disabled={isLoading}
                  className="bg-techtoniq-blue hover:bg-techtoniq-blue-dark whitespace-nowrap"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <MapPin className="mr-2 h-4 w-4" />
                      {location ? 'Update Location' : 'Get My Location'}
                    </>
                  )}
                </Button>
              </div>
            </div>
            
            {error && (
              <div className="border-t border-red-100">
                <Alert variant="destructive" className="m-0 rounded-none">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              </div>
            )}
          </Card>

          {prediction && (
            <>
              {/* Risk Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Risk Level */}
                <Card className="border-0 shadow">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg mr-3 ${getRiskColor(prediction.riskLevel).bg}`}>
                        {getRiskColor(prediction.riskLevel).icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-techtoniq-earth">RISK LEVEL</p>
                        <h3 className={`text-2xl font-bold ${getRiskColor(prediction.riskLevel).text}`}>
                          {getRiskLevelText(prediction.riskLevel)}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Probability</span>
                        <span className="font-medium">{Math.round((prediction.probability || 0) * 100)}%</span>
                      </div>
                      <Progress 
                        value={(prediction.probability || 0) * 100} 
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Safety Score */}
                <Card className="border-0 shadow">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-techtoniq-teal/10 mr-3">
                        <ShieldCheck className="h-5 w-5 text-techtoniq-teal" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-techtoniq-earth">SAFETY SCORE</p>
                        <h3 className={`text-2xl font-bold ${getSafetyScoreColor(prediction.safetyScore || 0)}`}>
                          {prediction.safetyScore}/100
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Infrastructure</span>
                        <span className="font-medium">{(prediction.safetyScore || 0) >= 75 ? 'Good' : 'Needs Attention'}</span>
                      </div>
                      <div className="relative h-2 w-full overflow-hidden rounded-full bg-gray-200">
                        <div 
                          className={`h-full ${getSafetyScoreColor(prediction.safetyScore || 0).replace('text-', 'bg-')}`}
                          style={{ width: `${prediction.safetyScore}%` }}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="border-0 shadow">
                  <CardHeader>
                    <div className="flex items-center">
                      <div className="p-2 rounded-lg bg-amber-100 mr-3">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-techtoniq-earth">RECENT ACTIVITY</p>
                        <h3 className="text-2xl font-bold text-techtoniq-earth-dark">
                          {prediction.historicalData?.lastMonth || 0}
                        </h3>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-techtoniq-earth">
                      Earthquakes in the last 30 days
                    </p>
                    <p className="text-xs text-techtoniq-earth/70 mt-1">
                      Last checked: {new Date(prediction.lastUpdated).toLocaleString()}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Recommendations */}
              <Card className="border-0 shadow mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-techtoniq-blue" />
                    Safety Recommendations
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {prediction.recommendations.map((rec, index) => (
                      <div key={index} className="flex items-start">
                        <div className="flex-shrink-0 h-5 w-5 text-techtoniq-blue mr-3 mt-0.5">
                          <ChevronRight className="h-5 w-5" />
                        </div>
                        <p className="text-techtoniq-earth">{rec}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter className="border-t border-gray-100">
                  <Button 
                    variant="outline" 
                    className="mr-3"
                    onClick={handleViewOnMap}
                  >
                    <MapIcon className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                  <Button onClick={handleSubscribe}>
                    <BellRing className="h-4 w-4 mr-2" />
                    Get Alerts for This Area
                  </Button>
                </CardFooter>
              </Card>

              {/* Nearby Fault Lines */}
              {prediction.nearbyFaultLines && prediction.nearbyFaultLines.length > 0 && (
                <Card className="border-0 shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <MapIcon className="h-5 w-5 mr-2 text-techtoniq-blue" />
                      Nearby Fault Lines
                    </CardTitle>
                    <CardDescription>
                      Active fault lines in your area
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {prediction.nearbyFaultLines.map((fault, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <h4 className="font-medium">{fault.name}</h4>
                            <p className="text-sm text-techtoniq-earth">
                              {formatDistance(fault.distance)} {fault.direction}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="text-techtoniq-blue">
                            View Details
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyLocation;
