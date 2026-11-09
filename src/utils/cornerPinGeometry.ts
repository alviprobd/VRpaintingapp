import * as THREE from 'three';
import { CornerPins } from '../types';

/**
 * Creates and updates a plane geometry where vertex positions are warped
 * using bilinear interpolation of 4 corner offsets.
 * Corner coordinates are normalized offsets from the baseline corners.
 */
export function createWarpedPlaneGeometry(
  width: number,
  height: number,
  segmentsX: number = 24,
  segmentsY: number = 24
): THREE.PlaneGeometry {
  return new THREE.PlaneGeometry(width, height, segmentsX, segmentsY);
}

export function updateGeometryCornerPins(
  geometry: THREE.PlaneGeometry,
  width: number,
  height: number,
  pins: CornerPins,
  enabled: boolean = true
) {
  const halfW = width / 2;
  const halfH = height / 2;

  // Base corners in local plane space:
  // TL: (-halfW,  halfH)
  // TR: ( halfW,  halfH)
  // BR: ( halfW, -halfH)
  // BL: (-halfW, -halfH)

  const tl = new THREE.Vector2(-halfW + (enabled ? pins.topLeft[0] * halfW : 0),  halfH + (enabled ? pins.topLeft[1] * halfH : 0));
  const tr = new THREE.Vector2( halfW + (enabled ? pins.topRight[0] * halfW : 0),  halfH + (enabled ? pins.topRight[1] * halfH : 0));
  const br = new THREE.Vector2( halfW + (enabled ? pins.bottomRight[0] * halfW : 0), -halfH + (enabled ? pins.bottomRight[1] * halfH : 0));
  const bl = new THREE.Vector2(-halfW + (enabled ? pins.bottomLeft[0] * halfW : 0), -halfH + (enabled ? pins.bottomLeft[1] * halfH : 0));

  const posAttr = geometry.attributes.position;
  const uvAttr = geometry.attributes.uv;

  for (let i = 0; i < posAttr.count; i++) {
    const u = uvAttr.getX(i);
    const v = uvAttr.getY(i);

    // Bilinear interpolation
    // BL is at u=0, v=0
    // BR is at u=1, v=0
    // TL is at u=0, v=1
    // TR is at u=1, v=1
    const x = (1 - u) * (1 - v) * bl.x + u * (1 - v) * br.x + (1 - u) * v * tl.x + u * v * tr.x;
    const y = (1 - u) * (1 - v) * bl.y + u * (1 - v) * br.y + (1 - u) * v * tl.y + u * v * tr.y;

    posAttr.setXY(i, x, y);
  }

  posAttr.needsUpdate = true;
  geometry.computeVertexNormals();
}
