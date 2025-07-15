import { FaultLine } from '@/types';
export type { FaultLine };
export declare const fetchFaultLinesFromUSGS: (lat: number, lng: number, radiusKm?: number) => Promise<FaultLine[]>;
