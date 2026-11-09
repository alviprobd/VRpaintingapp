import * as THREE from 'three';
import { LineArtMode } from '../types';

export const MuralVertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const MuralFragmentShader = `
  uniform sampler2D uTexture;
  uniform vec2 uResolution;
  uniform int uMode; // 0: original, 1: edges, 2: inverted_edges, 3: transparent_art, 4: stencil
  uniform float uOpacity;
  uniform float uEdgeThreshold;
  uniform float uEdgeThickness;
  uniform vec3 uLineColor;
  uniform bool uInvertColor;
  uniform float uContrast;
  uniform float uBrightness;
  uniform bool uRemoveWhiteBg;
  uniform bool uFlipH;
  uniform bool uFlipV;

  // Grid uniforms
  uniform int uGridMode; // 0: none, 1: metric, 2: thirds, 3: quadrant
  uniform float uGridOpacity;
  uniform vec3 uGridColor;
  uniform float uGridDivisions;

  varying vec2 vUv;

  // Grayscale conversion
  float rgbToGray(vec3 color) {
    return dot(color, vec3(0.299, 0.587, 0.114));
  }

  // Sobel Edge Detection
  float getSobelEdge(vec2 uv, vec2 pixelStep) {
    float tleft = rgbToGray(texture2D(uTexture, uv + vec2(-pixelStep.x, -pixelStep.y)).rgb);
    float tmid  = rgbToGray(texture2D(uTexture, uv + vec2(0.0, -pixelStep.y)).rgb);
    float tright= rgbToGray(texture2D(uTexture, uv + vec2(pixelStep.x, -pixelStep.y)).rgb);

    float mleft = rgbToGray(texture2D(uTexture, uv + vec2(-pixelStep.x, 0.0)).rgb);
    float mright= rgbToGray(texture2D(uTexture, uv + vec2(pixelStep.x, 0.0)).rgb);

    float bleft = rgbToGray(texture2D(uTexture, uv + vec2(-pixelStep.x, pixelStep.y)).rgb);
    float bmid  = rgbToGray(texture2D(uTexture, uv + vec2(0.0, pixelStep.y)).rgb);
    float bright= rgbToGray(texture2D(uTexture, uv + vec2(pixelStep.x, pixelStep.y)).rgb);

    float gx = -1.0 * tleft + 1.0 * tright - 2.0 * mleft + 2.0 * mright - 1.0 * bleft + 1.0 * bright;
    float gy = -1.0 * tleft - 2.0 * tmid - 1.0 * tright + 1.0 * bleft + 2.0 * bmid + 1.0 * bright;

    return length(vec2(gx, gy));
  }

  // Grid line calculator
  float computeGrid(vec2 uv) {
    if (uGridMode == 0) return 0.0;
    
    vec2 gridCount = vec2(uGridDivisions);
    if (uGridMode == 2) {
      gridCount = vec2(3.0);
    } else if (uGridMode == 3) {
      gridCount = vec2(2.0);
    }

    vec2 pos = fract(uv * gridCount);
    vec2 dist = min(pos, 1.0 - pos) * uResolution / gridCount;
    float lineThickness = 1.8;
    float minLine = min(dist.x, dist.y);
    return 1.0 - smoothstep(0.0, lineThickness, minLine);
  }

  void main() {
    vec2 uv = vUv;
    if (uFlipH) uv.x = 1.0 - uv.x;
    if (uFlipV) uv.y = 1.0 - uv.y;

    vec4 tex = texture2D(uTexture, uv);
    vec3 color = tex.rgb;

    // Apply Contrast and Brightness
    color = (color - 0.5) * uContrast + 0.5 + uBrightness;
    color = clamp(color, 0.0, 1.0);

    float gray = rgbToGray(color);
    vec2 pixelStep = (vec2(uEdgeThickness) / uResolution);

    vec4 outColor = vec4(0.0);

    if (uMode == 0) {
      // Original color mode
      float alpha = tex.a;
      if (uRemoveWhiteBg) {
        // Cut out white/cream paper background
        float whiteness = smoothstep(0.75, 0.95, gray);
        alpha *= (1.0 - whiteness);
      }
      outColor = vec4(color, alpha * uOpacity);
    } 
    else if (uMode == 1) {
      // Sobel Edge Detection (Outline Mural Mode)
      float edge = getSobelEdge(uv, pixelStep);
      float edgeVal = smoothstep(uEdgeThreshold, uEdgeThreshold + 0.08, edge);
      
      if (edgeVal > 0.05) {
        outColor = vec4(uLineColor, edgeVal * uOpacity);
      } else {
        outColor = vec4(0.0);
      }
    } 
    else if (uMode == 2) {
      // Inverted Glowing Edges
      float edge = getSobelEdge(uv, pixelStep);
      float edgeVal = smoothstep(uEdgeThreshold, uEdgeThreshold + 0.06, edge);
      vec3 glow = uInvertColor ? (vec3(1.0) - uLineColor) : uLineColor;
      outColor = vec4(glow, edgeVal * uOpacity);
    } 
    else if (uMode == 3) {
      // Transparent Art Mode (Dark ink strokes kept, paper is 100% transparent)
      float ink = 1.0 - gray;
      float inkStrength = smoothstep(1.0 - uEdgeThreshold * 2.5, 0.95, ink);
      vec3 inkColor = uInvertColor ? vec3(1.0) : uLineColor;
      outColor = vec4(inkColor, inkStrength * tex.a * uOpacity);
    } 
    else if (uMode == 4) {
      // Stencil / High-Contrast Binarization
      float binarized = step(uEdgeThreshold * 2.0, gray);
      if (uInvertColor) binarized = 1.0 - binarized;
      if (binarized < 0.5) {
        outColor = vec4(uLineColor, uOpacity);
      } else {
        outColor = vec4(0.0);
      }
    }

    // Overlay Grid Lines
    float gridVal = computeGrid(uv);
    if (gridVal > 0.05 && uGridOpacity > 0.0) {
      vec3 blended = mix(outColor.rgb, uGridColor, gridVal * uGridOpacity);
      float finalAlpha = max(outColor.a, gridVal * uGridOpacity);
      outColor = vec4(blended, finalAlpha);
    }

    // Outer framing border line for visual guidance
    float border = 0.003;
    if (uv.x < border || uv.x > 1.0 - border || uv.y < border || uv.y > 1.0 - border) {
      outColor = mix(outColor, vec4(uLineColor, 0.7), 0.5);
    }

    gl_FragColor = outColor;
  }
`;

export function getShaderModeNumber(mode: LineArtMode): number {
  switch (mode) {
    case 'original': return 0;
    case 'edges': return 1;
    case 'inverted_edges': return 2;
    case 'transparent_art': return 3;
    case 'stencil': return 4;
    default: return 1;
  }
}
