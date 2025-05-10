import { useState, useEffect, useRef } from 'react';
import { Bell, BellOff, AlertTriangle, Info } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { ShakeAlertEvent, fetchShakeAlertData } from '@/services/earthquakeService';

// Using ShakeAlertEvent interface from earthquakeService.ts

interface USGSShakeAlertProps {
  className?: string;
  onAlertReceived?: (alert: ShakeAlertEvent) => void;
}

const USGSShakeAlert = ({ className = '', onAlertReceived }: USGSShakeAlertProps) => {
  const [alerts, setAlerts] = useState<ShakeAlertEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(false);
  const alertAudioRef = useRef<HTMLAudioElement | null>(null);
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
      const newAlerts = shakeAlertEvents.filter(
        newAlert => !alerts.some(existingAlert => existingAlert.id === newAlert.id)
      );
      
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
    } catch (err) {
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
        toast({
          title: 'Notifications Enabled',
          description: 'You will now receive ShakeAlert notifications.',
          variant: 'default',
        });
      } else {
        toast({
          title: 'Notifications Disabled',
          description: 'You will not receive ShakeAlert notifications.',
          variant: 'default',
        });
      }
    } catch (err) {
      console.error('Error requesting notification permission:', err);
      toast({
        title: 'Permission Error',
        description: 'Could not request notification permission.',
        variant: 'destructive',
      });
    }
  };

  // Get alert level color
  const getAlertLevelColor = (level: ShakeAlertEvent['alertLevel']) => {
    switch (level) {
      case 'red': return 'bg-red-500';
      case 'orange': return 'bg-orange-500';
      case 'yellow': return 'bg-yellow-500';
      case 'green': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className={`rounded-lg border bg-white p-6 ${className}`}>
      <div className="mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-techtoniq-alert" />
            <h3 className="text-xl font-medium text-techtoniq-earth-dark">Earthquake ShakeAlert</h3>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Switch
                id="sound-mode"
                checked={soundEnabled}
                onCheckedChange={setSoundEnabled}
              />
              <Label htmlFor="sound-mode" className="text-sm">
                {soundEnabled ? <Bell className="h-4 w-4" /> : <BellOff className="h-4 w-4" />}
              </Label>
            </div>
            
            <Button
              variant={notificationsEnabled ? "default" : "outline"}
              size="sm"
              onClick={requestNotificationPermission}
            >
              {notificationsEnabled ? 'Notifications On' : 'Enable Notifications'}
            </Button>
          </div>
        </div>
        <div className="mt-1 flex items-center">
          <span className="text-xs text-gray-500 flex items-center">
            <span className="mr-1">Data sources:</span>
            <span className="font-medium mr-2">USGS</span> + 
            <span className="font-medium ml-2 flex items-center">
              <span className="mr-1">🇮🇳</span> National Center for Seismology
            </span>
          </span>
        </div>
      </div>
      
      <div className="mb-4 rounded-lg bg-blue-50 p-3 text-sm">
        <div className="flex gap-2">
          <Info className="h-5 w-5 flex-shrink-0 text-blue-500" />
          <div>
            <p className="font-medium text-blue-800">About ShakeAlert</p>
            <p className="mt-1 text-blue-700">
              ShakeAlert® is an earthquake early warning system that detects significant earthquakes and issues alerts before shaking arrives. 
              Currently available in California, Oregon, and Washington.
            </p>
            <p className="mt-1 text-blue-700">
              <span className="font-semibold text-blue-900">🇮🇳 Priority alerts for India are now available</span> through integration with the National Center for Seismology (NCS) real-time data.
            </p>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <div className="h-6 w-6 animate-spin rounded-full border-4 border-techtoniq-blue border-t-transparent"></div>
          <p className="mt-2 text-sm text-techtoniq-earth">Loading ShakeAlert data...</p>
        </div>
      ) : error ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <AlertTriangle className="mb-2 h-6 w-6 text-techtoniq-alert" />
          <p className="text-sm text-techtoniq-earth">{error}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={getShakeAlertData}
          >
            Try Again
          </Button>
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex h-40 flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 bg-gray-50">
          <Info className="mb-2 h-6 w-6 text-gray-400" />
          <p className="text-sm text-techtoniq-earth">No ShakeAlert events detected</p>
          <p className="mt-1 text-xs text-gray-500">The system is monitoring for earthquake activity</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
          {alerts.map(alert => (
            <div 
              key={alert.id} 
              className={`rounded-lg border p-3 hover:bg-gray-50 ${alert.isPriority ? 'border-2 border-orange-500 bg-orange-50' : ''}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${getAlertLevelColor(alert.alertLevel)}`}></div>
                    <h4 className="font-medium text-techtoniq-earth-dark">
                      M{alert.magnitude.toFixed(1)} Earthquake
                      {alert.isPriority && (
                        <span className="ml-2 rounded-full bg-orange-500 px-2 py-0.5 text-xs text-white">
                          🇮🇳 India Priority
                        </span>
                      )}
                    </h4>
                  </div>
                  <div className="flex items-center mt-1">
                    <p className="text-sm text-techtoniq-earth">{alert.location}</p>
                    {alert.url.includes('seismo.gov.in') && (
                      <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded">
                        NCS Data
                      </span>
                    )}
                    {!alert.url.includes('seismo.gov.in') && alert.isPriority && (
                      <span className="ml-2 text-xs bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                        USGS Data
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{alert.time}</p>
                </div>
                
                {alert.secondsUntilShaking !== undefined && (
                  <div className={`rounded-md ${alert.isPriority ? 'bg-orange-200' : 'bg-techtoniq-blue-light'} px-2 py-1 text-center`}>
                    <p className={`text-xs font-medium ${alert.isPriority ? 'text-orange-800' : 'text-techtoniq-blue-dark'}`}>
                      {alert.secondsUntilShaking > 0 
                        ? `${alert.secondsUntilShaking}s warning` 
                        : 'Shaking now'}
                    </p>
                  </div>
                )}
              </div>
              
              <div className="mt-2 flex items-center justify-between">
                <div>
                  <p className="text-xs text-techtoniq-earth">
                    Expected shaking: <span className="font-medium">{alert.expectedShaking}</span>
                  </p>
                </div>
                <a 
                  href={alert.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-techtoniq-blue hover:underline"
                >
                  View Details
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <p>Data refreshes every 60 seconds</p>
        <div className="flex gap-3">
          <a 
            href="https://www.shakealert.org/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-techtoniq-blue hover:underline"
          >
            USGS ShakeAlert
          </a>
          <span>|</span>
          <a 
            href="https://seismo.gov.in/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-techtoniq-blue hover:underline"
          >
            National Center for Seismology
          </a>
        </div>
      </div>
    </div>
  );
};

export default USGSShakeAlert;