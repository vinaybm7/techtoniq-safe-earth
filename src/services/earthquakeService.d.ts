export interface Earthquake {
    id: string;
    magnitude: number;
    location: string;
    date: string;
    depth: number;
    url: string;
    coordinates: [number, number];
    tsunami?: boolean;
    felt?: number | null;
    significance?: number;
    status?: string;
    alert?: string | null;
    localTime?: string;
}
export interface ShakeAlertEvent {
    id: string;
    title: string;
    magnitude: number;
    location: string;
    time: string;
    coordinates: [number, number];
    url: string;
    alertLevel: 'green' | 'yellow' | 'orange' | 'red' | null;
    expectedShaking: 'weak' | 'light' | 'moderate' | 'strong' | 'very strong' | 'severe' | 'violent' | 'extreme' | null;
    secondsUntilShaking?: number;
    isPriority?: boolean;
}
export declare const fetchRecentEarthquakes: () => Promise<Earthquake[]>;
export declare const fetchEarthquakesByTimeframe: (timeframe: "week" | "month") => Promise<Earthquake[]>;
export declare const fetchHistoricalIndianEarthquakes: () => Promise<Earthquake[]>;
/**
 * Fetches earthquake data from National Center for Seismology (NCS) API
 * This API provides real-time earthquake data for India
 */
export declare const fetchNCSEarthquakeData: () => Promise<ShakeAlertEvent[]>;
/**
 * Fetches ShakeAlert data for earthquake early warnings
 * Combines data from National Center for Seismology (NCS) for India
 * and USGS API for global coverage
 */
export declare const fetchShakeAlertData: () => Promise<ShakeAlertEvent[]>;
export declare const fetchEarthquakesByRegion: (region: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByMagnitude: (minMag: number, maxMag: number) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByDepth: (minDepth: number, maxDepth: number) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByDate: (startDate: Date, endDate: Date) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByCoordinates: (lat: number, lng: number) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByRadius: (lat: number, lng: number, radius: number) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByBoundingBox: (minLat: number, maxLat: number, minLng: number, maxLng: number) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPolygon: (points: [number, number][]) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByCountry: (country: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByState: (state: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByCity: (city: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByZipCode: (zipCode: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByAddress: (address: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceName: (placeName: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceType: (placeType: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceId: (placeId: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCode: (placeCode: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeType: (placeCodeType: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeValue: (placeCodeValue: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystem: (placeCodeSystem: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemName: (placeCodeSystemName: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemVersion: (placeCodeSystemVersion: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemOID: (placeCodeSystemOID: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemUID: (placeCodeSystemUID: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemURI: (placeCodeSystemURI: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemURL: (placeCodeSystemURL: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemURN: (placeCodeSystemURN: string) => Promise<Earthquake[]>;
export declare const fetchEarthquakesByPlaceCodeSystemUUID: (placeCodeSystemUUID: string) => Promise<Earthquake[]>;
