import GameObject from './GameObject';
import Component from './Component';
import Physical from './Physical';
import Game from './Game';

import Sprite from './util/Sprite';
import SpriteSheet from './util/SpriteSheet';

import AnimationManager from './components/AnimationManager';
import AssetManager from './components/AssetManager';
import AudioManager from './components/AudioManager';

export {
  GameObject,
  Component,
  Physical,
  AnimationManager,
  AssetManager,
  AudioManager,
  Sprite,
  SpriteSheet,
}

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
