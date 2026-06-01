declare namespace naver.maps {
  class Map {
    constructor(element: HTMLElement | string, options?: MapOptions);
    setCenter(latlng: LatLng): void;
    setZoom(zoom: number, useAnimation?: boolean): void;
    getZoom(): number;
    getCenter(): LatLng;
    panTo(latlng: LatLng): void;
    morph(latlng: LatLng, zoom?: number): void;
    destroy(): void;
  }

  class LatLng {
    constructor(lat: number, lng: number);
    lat(): number;
    lng(): number;
  }

  class LatLngBounds {
    constructor(sw: LatLng, ne: LatLng);
    extend(latlng: LatLng): void;
  }

  class Point {
    constructor(x: number, y: number);
  }

  class Size {
    constructor(width: number, height: number);
  }

  class Marker {
    constructor(options: MarkerOptions);
    setMap(map: Map | null): void;
    getPosition(): LatLng;
  }

  class InfoWindow {
    constructor(options: InfoWindowOptions);
    open(map: Map, anchor: Marker): void;
    close(): void;
    getMap(): Map | null;
  }

  class Polyline {
    constructor(options: PolylineOptions);
    setMap(map: Map | null): void;
    setPath(path: LatLng[]): void;
    setOptions(options: Partial<PolylineOptions>): void;
  }

  interface PolylineOptions {
    path?: LatLng[];
    map?: Map;
    strokeColor?: string;
    strokeOpacity?: number;
    strokeWeight?: number;
    strokeStyle?: string;
  }

  namespace Event {
    function addListener(
      target: object,
      type: string,
      listener: (...args: unknown[]) => void,
    ): unknown;
  }

  const Position: Record<string, number>;
  const ZoomControlStyle: Record<string, number>;

  interface MapOptions {
    center?: LatLng;
    zoom?: number;
    mapTypeControl?: boolean;
    logoControl?: boolean;
    scaleControl?: boolean;
    zoomControl?: boolean;
    zoomControlOptions?: { position?: number; style?: number };
  }

  interface MarkerOptions {
    position: LatLng;
    map?: Map;
    title?: string;
    icon?: MarkerIcon;
  }

  interface MarkerIcon {
    content?: string;
    size?: Size;
    anchor?: Point;
  }

  interface InfoWindowOptions {
    content: string;
    maxWidth?: number;
    borderWidth?: number;
    borderColor?: string;
    backgroundColor?: string;
    anchorSize?: Size;
    anchorSkew?: boolean;
    anchorColor?: string;
    pixelOffset?: Point;
  }
}

declare interface Window {
  naver: typeof naver;
}
