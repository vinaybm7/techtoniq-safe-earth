export interface Coordinates {
    lat: number;
    lng: number;
}
export interface FaultLine {
    name: string;
    distance: number;
    direction: string;
    type: string;
    coordinates: Coordinates;
}
export interface HistoricalData {
    lastMonth: number;
    lastYear: number;
    averageMagnitude: {
        min: number;
        max: number;
        average: number;
    };
}
export interface PredictionResponse {
    riskLevel: 'low' | 'medium' | 'high';
    probability: number;
    recommendations: string[];
    lastUpdated: string;
    historicalData: HistoricalData;
    nearbyFaultLines?: FaultLine[];
    safetyScore?: number;
    nextCheck?: string;
}
