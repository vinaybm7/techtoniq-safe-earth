import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { fetchShakeAlertData } from '@/services/earthquakeService';
const USGSShakeAlert = ({ className = '', onAlertReceived }) => {
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [notificationsEnabled, setNotificationsEnabled] = useState(() => {
        const saved = localStorage.getItem('notificationsEnabled');
        return saved ? JSON.parse(saved) : false;
    });
    const [soundEnabled, setSoundEnabled] = useState(() => {
        const saved = localStorage.getItem('soundEnabled');
        return saved ? JSON.parse(saved) : false;
    });
    const alertAudioRef = useRef(null);
    const { toast } = useToast();
    // Initialize audio element for alerts
    useEffect(() => {
        alertAudioRef.current = new Audio('/alert-sound.mp3'); // You'll need to add this sound file to your public folder
        alertAudioRef.current.preload = 'auto';
        return () => {
            if (alertAudioRef.current) {
                alertAudioRef.current.pause();
                alertAudioRef.current = null;
            }
        };
    }, []);
    // Function to fetch ShakeAlert data using the service
    const getShakeAlertData = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // Use the service function to fetch ShakeAlert data
            const shakeAlertEvents = await fetchShakeAlertData();
            // Check if there are new alerts
            const newAlerts = shakeAlertEvents.filter(newAlert => !alerts.some(existingAlert => existingAlert.id === newAlert.id));
            if (newAlerts.length > 0 && notificationsEnabled) {
                // Notify about new alerts
                newAlerts.forEach(alert => {
                    // Show toast notification with special handling for India priority alerts
                    toast({
                        title: `${alert.isPriority ? '🇮🇳 PRIORITY ' : ''}ShakeAlert: M${alert.magnitude.toFixed(1)} Earthquake`,
                        description: `${alert.location}. ${alert.isPriority ? 'INDIA PRIORITY ALERT. ' : ''}Expected shaking: ${alert.expectedShaking}`,
                        variant: alert.isPriority ? 'destructive' : (alert.magnitude >= 5.0 ? 'destructive' : 'default'),
                    });
                    // Play sound if enabled (always play for India priority alerts)
                    if ((soundEnabled || alert.isPriority) && alertAudioRef.current) {
                        alertAudioRef.current.play().catch(e => console.error('Error playing alert sound:', e));
                    }
                    // Call the callback if provided
                    if (onAlertReceived) {
                        onAlertReceived(alert);
                    }
                });
            }
            setAlerts(shakeAlertEvents);
            setIsLoading(false);
        }
        catch (err) {
            console.error('Error fetching ShakeAlert data:', err);
            setError('Failed to fetch ShakeAlert data. Please try again later.');
            setIsLoading(false);
        }
    };
    // Fetch data initially and set up polling
    useEffect(() => {
        getShakeAlertData();
        // Poll for new data every 60 seconds
        const intervalId = setInterval(getShakeAlertData, 60000);
        return () => clearInterval(intervalId);
    }, [notificationsEnabled, soundEnabled]);
    // Request notification permission
    const requestNotificationPermission = async () => {
        if (!('Notification' in window)) {
            toast({
                title: 'Notifications Not Supported',
                description: 'Your browser does not support desktop notifications.',
                variant: 'destructive',
            });
            return;
        }
        try {
            const permission = await Notification.requestPermission();
            if (permission === 'granted') {
                setNotificationsEnabled(true);
                localStorage.setItem('notificationsEnabled', JSON.stringify(true));
                toast({
                    title: 'Notifications Enabled',
                    description: 'You will now receive ShakeAlert notifications.',
                    variant: 'default',
                });
            }
            else {
                toast({
                    title: 'Notifications Disabled',
                    description: 'You will not receive ShakeAlert notifications.',
                    variant: 'default',
                });
            }
        }
        catch (err) {
            console.error('Error requesting notification permission:', err);
            toast({
                title: 'Permission Error',
                description: 'Could not request notification permission.',
                variant: 'destructive',
            });
        }
    };
    // Get alert level color
    const getAlertLevelColor = (level) => {
        switch (level) {
            case 'red': return 'bg-red-500';
            case 'orange': return 'bg-orange-500';
            case 'yellow': return 'bg-yellow-500';
            case 'green': return 'bg-green-500';
            default: return 'bg-gray-500';
        }
    };
    return (_jsxs("div", { className: `rounded-lg border bg-white p-6 ${className}`, children: [_jsxs("div", { className: "mb-4", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx(AlertTriangle, { className: "h-5 w-5 text-techtoniq-alert" }), _jsx("h3", { className: "text-xl font-medium text-techtoniq-earth-dark", children: "Earthquake ShakeAlert" })] }), _jsxs("div", { className: "flex items-center gap-4", children: [_jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Switch, { id: "sound-mode", checked: soundEnabled, onCheckedChange: (checked) => {
                                                    setSoundEnabled(checked);
                                                    localStorage.setItem('soundEnabled', JSON.stringify(checked));
                                                } }), _jsxs(Label, { htmlFor: "sound-mode", className: "text-sm flex items-center gap-1", children: [soundEnabled ? _jsx(Bell, { className: "h-4 w-4" }) : _jsx(BellOff, { className: "h-4 w-4" }), _jsx("span", { className: "ml-1", children: "Sound Alerts" })] })] }), _jsx(Switch, { id: "notification-mode", checked: notificationsEnabled, onCheckedChange: async (checked) => {
                                            if (checked) {
                                                await requestNotificationPermission();
                                            }
                                            else {
                                                setNotificationsEnabled(false);
                                                localStorage.setItem('notificationsEnabled', JSON.stringify(false));
                                                toast({
                                                    title: 'Notifications Disabled',
                                                    description: 'You will not receive ShakeAlert notifications.',
                                                    variant: 'default',
                                                });
                                            }
                                        } }), _jsx(Label, { htmlFor: "notification-mode", className: "text-sm", children: notificationsEnabled ? 'Notifications On' : 'Enable Notifications' })] })] }), _jsx("div", { className: "mt-1 flex items-center", children: _jsxs("span", { className: "text-xs text-gray-500 flex items-center", children: [_jsx("span", { className: "mr-1", children: "Data sources:" }), _jsx("span", { className: "font-medium mr-2", children: "USGS" }), " +", _jsxs("span", { className: "font-medium ml-2 flex items-center", children: [_jsx("span", { className: "mr-1", children: "\uD83C\uDDEE\uD83C\uDDF3" }), " National Center for Seismology"] })] }) })] }), _jsx("div", { className: "mb-4 rounded-lg bg-blue-50 p-3 text-sm", children: _jsxs("div", { className: "flex gap-2", children: [_jsx(Info, { className: "h-5 w-5 flex-shrink-0 text-blue-500" }), _jsxs("div", { children: [_jsx("p", { className: "font-medium text-blue-800", children: "AI-Powered Earthquake Prediction" }), _jsx("p", { className: "mt-1 text-blue-700", children: "Our advanced system now integrates Google Gemini API to analyze seismic patterns and predict potential earthquake events before they happen. Get personalized risk assessments and AI-generated safety recommendations based on your location." }), _jsxs("p", { className: "mt-1 text-blue-700", children: [_jsx("span", { className: "font-semibold text-blue-900", children: "\uD83C\uDDEE\uD83C\uDDF3 Priority alerts for India are now available" }), " with enhanced prediction accuracy through AI analysis of National Center for Seismology (NCS) real-time data."] })] })] }) }), isLoading ? (_jsxs("div", { className: "flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50", children: [_jsx("div", { className: "h-6 w-6 animate-spin rounded-full border-4 border-techtoniq-blue border-t-transparent" }), _jsx("p", { className: "mt-2 text-sm text-techtoniq-earth", children: "Loading ShakeAlert data..." })] })) : error ? (_jsxs("div", { className: "flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50", children: [_jsx(AlertTriangle, { className: "mb-2 h-6 w-6 text-techtoniq-alert" }), _jsx("p", { className: "text-sm text-techtoniq-earth", children: error }), _jsx(Button, { variant: "outline", size: "sm", className: "mt-3", onClick: getShakeAlertData, children: "Try Again" })] })) : alerts.length === 0 ? (_jsxs("div", { className: "flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50", children: [_jsx(Info, { className: "mb-2 h-6 w-6 text-gray-400" }), _jsx("p", { className: "text-sm text-techtoniq-earth", children: "No ShakeAlert events detected" }), _jsx("p", { className: "mt-1 text-xs text-gray-500", children: "The system is monitoring for earthquake activity" })] })) : (_jsx("div", { className: "space-y-3 max-h-80 overflow-y-auto pr-2", children: alerts.map(alert => (_jsxs("div", { className: `rounded-lg border p-3 hover:bg-gray-50 ${alert.isPriority ? 'border-2 border-orange-500 bg-orange-50' : ''}`, children: [_jsxs("div", { className: "flex items-start justify-between", children: [_jsxs("div", { children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: `h-3 w-3 rounded-full ${getAlertLevelColor(alert.alertLevel)}` }), _jsxs("h4", { className: "font-medium text-techtoniq-earth-dark", children: ["M", alert.magnitude.toFixed(1), " Earthquake", alert.isPriority && (_jsx("span", { className: "ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white", children: "\uD83C\uDDEE\uD83C\uDDF3 India Priority" }))] })] }), _jsxs("div", { className: "flex items-center mt-1", children: [_jsx("p", { className: "text-sm text-techtoniq-earth", children: alert.location }), alert.url.includes('seismo.gov.in') && (_jsx("span", { className: "ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded", children: "NCS Data" })), !alert.url.includes('seismo.gov.in') && alert.isPriority && (_jsx("span", { className: "ml-2 text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded", children: "USGS Data" }))] }), _jsx("p", { className: "mt-0.5 text-xs text-gray-500", children: alert.time })] }), alert.secondsUntilShaking !== undefined && (_jsx("div", { className: `rounded-md ${alert.isPriority ? 'bg-orange-200' : 'bg-techtoniq-blue-light'} px-2 py-1 text-center`, children: _jsx("p", { className: `text-xs font-medium ${alert.isPriority ? 'text-orange-800' : 'text-techtoniq-blue-dark'}`, children: alert.secondsUntilShaking > 0
                                            ? `${alert.secondsUntilShaking}s warning`
                                            : 'Shaking now' }) }))] }), _jsxs("div", { className: "mt-2 flex items-center justify-between", children: [_jsx("div", { children: _jsxs("p", { className: "text-xs text-techtoniq-earth", children: ["Expected shaking: ", _jsx("span", { className: "font-medium", children: alert.expectedShaking })] }) }), _jsx("a", { href: alert.url, target: "_blank", rel: "noopener noreferrer", className: "text-xs text-techtoniq-blue hover:underline", children: "View Details" })] })] }, alert.id))) })), _jsxs("div", { className: "mt-4 flex justify-between items-center text-xs text-gray-500", children: [_jsx("p", { children: "Data refreshes every 60 seconds" }), _jsxs("div", { className: "flex gap-3", children: [_jsx("a", { href: "https://www.shakealert.org/", target: "_blank", rel: "noopener noreferrer", className: "text-techtoniq-blue hover:underline", children: "USGS ShakeAlert" }), _jsx("span", { children: "|" }), _jsx("a", { href: "https://seismo.gov.in/", target: "_blank", rel: "noopener noreferrer", className: "text-techtoniq-blue hover:underline", children: "National Center for Seismology" })] })] })] }));
};
export default USGSShakeAlert;
