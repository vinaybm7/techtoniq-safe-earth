import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { GEMINI_API_KEY } from "@/config";
import { PredictionResponse } from '@/types';
import { getNearbyFaultLines } from '@/utils/geologicalData';

const getNearbyFaultLinesData = async (lat: number, lng: number) => {
  try {
    const faultLines = await getNearbyFaultLines(lat, lng, 200);
    if (faultLines.length === 0) {
      return await getNearbyFaultLines(lat, lng, 500);
    }
    return faultLines;
  } catch (error) {
    return [];
  }
};

async function getGeminiPrediction(lat: number, lng: number): Promise<PredictionResponse> {
  const nearbyFaultLines = await getNearbyFaultLinesData(lat, lng);
  const faultLineContext = nearbyFaultLines.length > 0
    ? `The location is near the following fault lines: ${nearbyFaultLines.map(f => `${f.name} (${f.distance.toFixed(1)}km ${f.direction})`).join(', ')}. `
    : 'No known major fault lines were found nearby. ';
  if (!GEMINI_API_KEY || GEMINI_API_KEY === 'YOUR_GEMINI_API_KEY') {
    throw new Error('No valid Gemini API key found. Please contact support.');
  }
  const prompt = `Analyze the earthquake risk for location at ${lat}, ${lng}. ${faultLineContext}
  Provide a JSON response with the following structure: { ... }`;
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
  if (!result.riskLevel || !result.probability || !result.recommendations) {
    throw new Error('Invalid response structure from Gemini API.');
  }
  return result;
}

const MyLocation = () => {
  const [location, setLocation] = useState<{ lat: number; lng: number; address?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [prediction, setPrediction] = useState<PredictionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (location) {
      loadPrediction(location.lat, location.lng);
    }
  }, [location]);

  const loadPrediction = async (lat: number, lng: number) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await getGeminiPrediction(lat, lng);
      setPrediction(response);
    } catch (err: any) {
      setError(err.message || 'Failed to load prediction from Gemini AI.');
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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4 text-center">My Location Safety</h1>
      <p className="mb-6 text-center text-gray-600">Get personalized earthquake risk assessment and safety recommendations for your current location.</p>
      <div className="flex flex-col items-center mb-8">
        <div className="flex items-center space-x-4">
          <span className="font-semibold text-lg">{location ? `Approx. ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E` : 'Location not set'}</span>
          <Button onClick={getUserLocation} disabled={isLoading}>
            {isLoading ? 'Loading...' : 'Update Location'}
          </Button>
        </div>
        {location && <div className="text-xs text-gray-500 mt-1">{location.lat}, {location.lng}</div>}
      </div>
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded mb-6 text-center">{error}</div>
      )}
      {prediction && !error && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border rounded-lg p-6 shadow">
            <div className="text-sm font-medium text-gray-500 mb-2">RISK LEVEL</div>
            <div className="text-2xl font-bold mb-2 text-green-600">{prediction.riskLevel === 'low' ? 'Low Risk' : prediction.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk'}</div>
            <div className="flex justify-between text-sm mb-1">
              <span>Probability</span>
              <span className="font-medium">{Math.round((prediction.probability || 0) * 100)}%</span>
            </div>
            <Progress value={(prediction.probability || 0) * 100} className="h-2" />
          </div>
          <div className="border rounded-lg p-6 shadow">
            <div className="text-sm font-medium text-gray-500 mb-2">SAFETY SCORE</div>
            <div className="text-2xl font-bold mb-2 text-green-600">{Math.round(prediction.safetyScore)}/100</div>
            <div className="flex justify-between text-sm mb-1">
              <span>Infrastructure</span>
              <span className="font-medium">{prediction.safetyScore > 70 ? 'Good' : prediction.safetyScore > 40 ? 'Needs Attention' : 'Poor'}</span>
            </div>
            <Progress value={prediction.safetyScore} className="h-2" />
          </div>
          <div className="border rounded-lg p-6 shadow">
            <div className="text-sm font-medium text-gray-500 mb-2">RECENT ACTIVITY</div>
            <div className="text-2xl font-bold mb-2 text-yellow-600">{prediction.historicalData?.lastMonth ?? '-'}</div>
            <div className="text-sm text-gray-500">Earthquakes in the last 30 days</div>
            <div className="text-xs text-gray-400 mt-1">Last checked: {new Date().toLocaleString()}</div>
          </div>
        </div>
      )}
      {prediction && !error && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Safety Recommendations</h2>
          <ul className="list-disc pl-6">
            {prediction.recommendations?.map((rec, idx) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MyLocation;
