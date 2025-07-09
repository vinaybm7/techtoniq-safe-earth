import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import Header from "@/components/Header";
import PageBreadcrumbs from "@/components/PageBreadcrumbs";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Info } from "lucide-react";

const GEMINI_API_KEY = 'AIzaSyCZEc1WQiieUiM0ab0K8pk4apASpspYz98';
const CACHE_EXPIRY_TIME = 60 * 60 * 1000; // 1 hour

const MyLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  // Load cached prediction on mount
  useEffect(() => {
    const cachedPrediction = localStorage.getItem('cached_my_location_prediction');
    const cachedTimestamp = localStorage.getItem('cached_my_location_prediction_timestamp');
    if (cachedPrediction && cachedTimestamp) {
      const cachedTime = new Date(cachedTimestamp);
      const now = new Date();
      setLastUpdateTime(cachedTime);
      if (now.getTime() - cachedTime.getTime() < CACHE_EXPIRY_TIME) {
        try {
          setPrediction(JSON.parse(cachedPrediction));
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (location) {
      loadPrediction(location.lat, location.lng);
    }
    // eslint-disable-next-line
  }, [location]);

  const cachePrediction = useCallback((predictionToCache: any) => {
    try {
      localStorage.setItem('cached_my_location_prediction', JSON.stringify(predictionToCache));
      const now = new Date();
      localStorage.setItem('cached_my_location_prediction_timestamp', now.toISOString());
      setLastUpdateTime(now);
    } catch {}
  }, []);

  const getGeminiPrediction = async (lat: number, lng: number) => {
    if (!GEMINI_API_KEY) {
      throw new Error('No valid Gemini API key found. Please contact support.');
    }
    const prompt = `Analyze the earthquake risk for the location at ${lat}, ${lng}. Provide a JSON response with the following structure: { "riskLevel": "low|medium|high", "probability": number (0-1), "safetyScore": number (0-100), "historicalData": { "lastMonth": number }, "recommendations": string[] }`;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2, topP: 0.8, topK: 40 },
      }),
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) {
      throw new Error(`Gemini API request failed with status ${response.status}`);
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
    if (!result.riskLevel || typeof result.probability !== 'number' || !result.recommendations) {
      throw new Error('There is no prediction for your location as the data is not sufficient.');
    }
    return result;
  };

  const loadPrediction = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getGeminiPrediction(lat, lng);
      setPrediction(response);
      cachePrediction(response);
    } catch (err: any) {
      if (err.message && err.message.includes('No valid Gemini API key')) {
        setError('No valid Gemini API key found. Please contact support.');
      } else if (err.message && (err.message.includes('There is no prediction for your location') || err.message.includes('Invalid response structure') || err.message.includes('No content in Gemini API response'))) {
        setError('There is no prediction for your location as the data is not sufficient.');
      } else {
        setError(err.message || 'Failed to load prediction from Gemini AI.');
      }
      setPrediction(null);
    } finally {
      setIsLoading(false);
    }
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
        const mockAddress = `Approx. ${Math.abs(latitude).toFixed(4)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(4)}°${longitude >= 0 ? 'E' : 'W'}`;
        setLocation({ lat: latitude, lng: longitude, address: mockAddress });
      },
      (error) => {
        setError("Unable to retrieve your location. Please ensure location services are enabled and try again.");
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  return (
    <>
      <Header />
      <PageBreadcrumbs items={[{ label: 'My Location Safety' }]} />
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-4 text-center text-techtoniq-earth-dark">My Location Safety</h1>
        <p className="mb-8 text-center text-techtoniq-earth">Get personalized earthquake risk assessment and safety recommendations for your current location.</p>
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-lg">{location ? `Approx. ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E` : 'Location not set'}</span>
            <Button onClick={getUserLocation} disabled={isLoading}>
              {isLoading ? 'Loading...' : 'Update Location'}
            </Button>
          </div>
          {location && <div className="text-xs text-gray-500 mt-1">{location.lat}, {location.lng}</div>}
        </div>
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded mb-8 text-center font-medium border border-red-200 max-w-xl mx-auto">{error}</div>
        )}
        {prediction && !error && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <Card className="shadow-sm">
              <CardHeader>
                <CardDescription>RISK LEVEL</CardDescription>
                <CardTitle className={prediction.riskLevel === 'low' ? 'text-green-600' : prediction.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600'}>
                  {prediction.riskLevel === 'low' ? 'Low Risk' : prediction.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span>Probability</span>
                  <span className="font-medium">{Math.round((prediction.probability || 0) * 100)}%</span>
                </div>
                <Progress value={(prediction.probability || 0) * 100} className="h-2" />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardDescription>SAFETY SCORE</CardDescription>
                <CardTitle className="text-green-600">{Math.round(prediction.safetyScore ?? 0)}/100</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between text-sm mb-1">
                  <span>Infrastructure</span>
                  <span className="font-medium">{(prediction.safetyScore ?? 0) > 70 ? 'Good' : (prediction.safetyScore ?? 0) > 40 ? 'Needs Attention' : 'Poor'}</span>
                </div>
                <Progress value={prediction.safetyScore ?? 0} className="h-2" />
              </CardContent>
            </Card>
            <Card className="shadow-sm">
              <CardHeader>
                <CardDescription>RECENT ACTIVITY</CardDescription>
                <CardTitle className="text-yellow-600">{prediction.historicalData?.lastMonth ?? '-'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-500">Earthquakes in the last 30 days</div>
                <div className="text-xs text-gray-400 mt-1">Last checked: {lastUpdateTime ? lastUpdateTime.toLocaleString() : new Date().toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>
        )}
        {prediction && !error && (
          <Card className="max-w-3xl mx-auto bg-techtoniq-blue-light/20 border-blue-100 shadow-sm">
            <CardHeader className="flex flex-row items-center gap-2 pb-2">
              <Info className="h-5 w-5 text-techtoniq-blue" />
              <CardTitle className="text-lg text-techtoniq-earth-dark">Safety Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-6 space-y-2 text-techtoniq-earth text-base">
                {prediction.recommendations?.map((rec: string, idx: number) => (
                  <li key={idx}>{rec}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  );
};

export default MyLocation;
