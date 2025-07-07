import * as mapboxgl from 'mapbox-gl';

declare module 'mapbox-gl' {
  export class TerrainControl implements mapboxgl.IControl {
    constructor(options: {
      source: string;
      exaggeration: number;
    });
    onAdd(map: mapboxgl.Map): HTMLElement;
    onRemove(map: mapboxgl.Map): void;
    getDefaultPosition?: () => string;
  }
}
