import {Coordinates} from 'pearl';

export function max(x: number, y: number): number {
  return x > y ? x : y;
}

export function min(x: number, y: number): number {
  return x < y ? x : y;
}

/*
 * Return a number between min and max inclusive
 */
export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}