import { FaultLine } from '@/types';
export declare const getNearbyFaultLines: (lat: number, lng: number, radiusKm?: number) => Promise<FaultLine[]>;
