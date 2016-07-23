import {Coordinates} from 'pearl';

export function max(x: number, y: number): number {
  return x > y ? x : y;
}

export function min(x: number, y: number): number {
  return x < y ? x : y;
}

type SidePositions = {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

type Intersection = {
  sides: SidePositions;
  w: number;
  h: number;
  fromAbove: boolean;
  fromLeft: boolean;
}

type BoundingBox = {
  size: Coordinates;
  center: Coordinates;
}

function sidesForBoundingBox(boundingBox: BoundingBox): SidePositions {
  return {
    left: boundingBox.center.x - boundingBox.size.x / 2,
    right: boundingBox.center.x + boundingBox.size.x / 2,
    top: boundingBox.center.y - boundingBox.size.y / 2,
    bottom: boundingBox.center.y + boundingBox.size.y / 2,
  };
}

export function rectangleIntersection(self: BoundingBox, other: BoundingBox): Intersection {
  // returns the size of the intersection between two rectangles as {w, h}
  const r1 = sidesForBoundingBox(self);
  const r2 = sidesForBoundingBox(other);
  const sides = {
    left: max(r1.left, r2.left),
    right: min(r1.right, r2.right),
    bottom: min(r1.bottom, r2.bottom),
    top: max(r1.top, r2.top),
  };

  return {
    sides: sides,
    w: sides.right - sides.left,
    h: sides.bottom - sides.top,
    fromAbove: sides.top === r2.top,
    fromLeft: sides.left === r2.left,
  };
}

export function calcVector(magnitude: number, rad: number): Coordinates {
  const x = magnitude * Math.cos(rad);
  const y = magnitude * Math.sin(rad);
  return { x: x, y: y };
}

/*
 * Return a number between min and max inclusive
 */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}