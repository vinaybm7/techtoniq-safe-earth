import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
    const [location, setLocation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState(null);
    const [lastUpdateTime, setLastUpdateTime] = useState(null);
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
                }
                catch { }
            }
        }
    }, []);
    useEffect(() => {
        if (location) {
            loadPrediction(location.lat, location.lng);
        }
        // eslint-disable-next-line
    }, [location]);
    const cachePrediction = useCallback((predictionToCache) => {
        try {
            localStorage.setItem('cached_my_location_prediction', JSON.stringify(predictionToCache));
            const now = new Date();
            localStorage.setItem('cached_my_location_prediction_timestamp', now.toISOString());
            setLastUpdateTime(now);
        }
        catch { }
    }, []);
    const getGeminiPrediction = async (lat, lng) => {
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
    const loadPrediction = async (lat, lng) => {
        setIsLoading(true);
        setError("");
        try {
            const response = await getGeminiPrediction(lat, lng);
            setPrediction(response);
            cachePrediction(response);
        }
        catch (err) {
            if (err.message && err.message.includes('No valid Gemini API key')) {
                setError('No valid Gemini API key found. Please contact support.');
            }
            else if (err.message && (err.message.includes('There is no prediction for your location') || err.message.includes('Invalid response structure') || err.message.includes('No content in Gemini API response'))) {
                setError('There is no prediction for your location as the data is not sufficient.');
            }
            else {
                setError(err.message || 'Failed to load prediction from Gemini AI.');
            }
            setPrediction(null);
        }
        finally {
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
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            const mockAddress = `Approx. ${Math.abs(latitude).toFixed(4)}°${latitude >= 0 ? 'N' : 'S'}, ${Math.abs(longitude).toFixed(4)}°${longitude >= 0 ? 'E' : 'W'}`;
            setLocation({ lat: latitude, lng: longitude, address: mockAddress });
        }, (error) => {
            setError("Unable to retrieve your location. Please ensure location services are enabled and try again.");
            setIsLoading(false);
        }, { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 });
    };
    return (_jsxs(_Fragment, { children: [_jsx(Header, {}), _jsx(PageBreadcrumbs, { items: [{ label: 'My Location Safety' }] }), _jsxs("div", { className: "container mx-auto py-8", children: [_jsx("h1", { className: "text-3xl font-bold mb-4 text-center text-techtoniq-earth-dark", children: "My Location Safety" }), _jsx("p", { className: "mb-8 text-center text-techtoniq-earth", children: "Get personalized earthquake risk assessment and safety recommendations for your current location." }), _jsxs("div", { className: "flex flex-col items-center mb-10", children: [_jsxs("div", { className: "flex items-center space-x-4", children: [_jsx("span", { className: "font-semibold text-lg", children: location ? `Approx. ${location.lat.toFixed(4)}°N, ${location.lng.toFixed(4)}°E` : 'Location not set' }), _jsx(Button, { onClick: getUserLocation, disabled: isLoading, children: isLoading ? 'Loading...' : 'Update Location' })] }), location && _jsxs("div", { className: "text-xs text-gray-500 mt-1", children: [location.lat, ", ", location.lng] })] }), error && (_jsx("div", { className: "bg-red-100 text-red-700 p-4 rounded mb-8 text-center font-medium border border-red-200 max-w-xl mx-auto", children: error })), prediction && !error && (_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-10", children: [_jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardDescription, { children: "RISK LEVEL" }), _jsx(CardTitle, { className: prediction.riskLevel === 'low' ? 'text-green-600' : prediction.riskLevel === 'medium' ? 'text-yellow-600' : 'text-red-600', children: prediction.riskLevel === 'low' ? 'Low Risk' : prediction.riskLevel === 'medium' ? 'Medium Risk' : 'High Risk' })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { children: "Probability" }), _jsxs("span", { className: "font-medium", children: [Math.round((prediction.probability || 0) * 100), "%"] })] }), _jsx(Progress, { value: (prediction.probability || 0) * 100, className: "h-2" })] })] }), _jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardDescription, { children: "SAFETY SCORE" }), _jsxs(CardTitle, { className: "text-green-600", children: [Math.round(prediction.safetyScore ?? 0), "/100"] })] }), _jsxs(CardContent, { children: [_jsxs("div", { className: "flex justify-between text-sm mb-1", children: [_jsx("span", { children: "Infrastructure" }), _jsx("span", { className: "font-medium", children: (prediction.safetyScore ?? 0) > 70 ? 'Good' : (prediction.safetyScore ?? 0) > 40 ? 'Needs Attention' : 'Poor' })] }), _jsx(Progress, { value: prediction.safetyScore ?? 0, className: "h-2" })] })] }), _jsxs(Card, { className: "shadow-sm", children: [_jsxs(CardHeader, { children: [_jsx(CardDescription, { children: "RECENT ACTIVITY" }), _jsx(CardTitle, { className: "text-yellow-600", children: prediction.historicalData?.lastMonth ?? '-' })] }), _jsxs(CardContent, { children: [_jsx("div", { className: "text-sm text-gray-500", children: "Earthquakes in the last 30 days" }), _jsxs("div", { className: "text-xs text-gray-400 mt-1", children: ["Last checked: ", lastUpdateTime ? lastUpdateTime.toLocaleString() : new Date().toLocaleString()] })] })] })] })), prediction && !error && (_jsxs(Card, { className: "max-w-3xl mx-auto bg-techtoniq-blue-light/20 border-blue-100 shadow-sm", children: [_jsxs(CardHeader, { className: "flex flex-row items-center gap-2 pb-2", children: [_jsx(Info, { className: "h-5 w-5 text-techtoniq-blue" }), _jsx(CardTitle, { className: "text-lg text-techtoniq-earth-dark", children: "Safety Recommendations" })] }), _jsx(CardContent, { children: _jsx("ul", { className: "list-disc pl-6 space-y-2 text-techtoniq-earth text-base", children: prediction.recommendations?.map((rec, idx) => (_jsx("li", { children: rec }, idx))) }) })] }))] })] }));
};
export default MyLocation;
