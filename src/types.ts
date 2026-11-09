export type LineArtMode = 
  | 'edges'            // Sobel/Laplacian contour outlines
  | 'inverted_edges'   // Glowing neon/white outlines on transparent background
  | 'transparent_art'  // Removes white/light background so only line art is drawn
  | 'stencil'          // High-contrast binarized stencil (for spray paint / rollers)
  | 'original';        // Full color original with transparency

export type GridMode = 'none' | 'metric' | 'thirds' | 'quadrant';

export type SurfaceSnap = 'wall' | 'table' | 'free';

export type PreviewBackground = 'passthrough_cam' | 'room_simulator' | 'dark_studio';

export interface CornerPins {
  topLeft: [number, number];
  topRight: [number, number];
  bottomRight: [number, number];
  bottomLeft: [number, number];
}

export interface MuralSettings {
  // Image & Outline Processing
  lineArtMode: LineArtMode;
  opacity: number;           // 0 to 1
  edgeThreshold: number;     // 0.02 to 0.4
  edgeThickness: number;     // 1.0 to 4.0
  lineColor: string;         // Hex color for outlines
  invertColor: boolean;
  contrast: number;          // 0.5 to 3.0
  brightness: number;        // -0.5 to 0.5
  removeWhiteBg: boolean;    // Cut out light paper backgrounds

  // Transform & Alignment
  scaleMeters: number;       // Width in real-world meters
  aspectRatio: number;       // width / height
  distanceMeters: number;    // Distance from camera/origin
  heightMeters: number;      // Height from floor
  pitchDeg: number;          // Tilt forward/back
  yawDeg: number;            // Turn left/right
  rollDeg: number;           // Rotate on wall
  flipH: boolean;
  flipV: boolean;
  locked: boolean;           // Freezes transform in world space

  // Keystone / Corner Pinning
  cornerPinningEnabled: boolean;
  cornerPins: CornerPins;

  // Grid & Mural Layout Tools
  gridMode: GridMode;
  gridOpacity: number;
  gridColor: string;
  gridDivisions: number;

  // Flash / Check Painting Tool
  blinkActive: boolean;

  // Environment & View
  previewBackground: PreviewBackground;
  showTapeMarkers: boolean;
  showDimensionBadge: boolean;
}

export interface PresetImage {
  id: string;
  title: string;
  category: 'Botanical' | 'Geometric' | 'Street Art' | 'Classical' | 'Typography';
  description: string;
  url: string;
  defaultMode: LineArtMode;
  aspectRatio: number;
  recommendedWidthM: number;
}
