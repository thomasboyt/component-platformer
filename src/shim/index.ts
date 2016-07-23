import GameObject from './GameObject';
import Component from './Component';
import Physical from './Physical';
import Game from './Game';

interface CreateGameOpts {
  rootComponents: Component[],
  canvas: HTMLCanvasElement,
  width: number;
  height: number;
  backgroundColor?: string;
}

export function createGame(opts: CreateGameOpts) {
  const game = new Game(opts.rootComponents);

  return game.run(opts);
}

export {
  GameObject,
  Component,
  Physical,
}