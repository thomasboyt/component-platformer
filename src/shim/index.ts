import GameObject from './GameObject';
import Component from './Component';
import Game from './Game';

import Sprite from './util/Sprite';
import SpriteSheet from './util/SpriteSheet';

import Physical from './components/Physical';
import AnimationManager from './components/AnimationManager';
import AssetManager from './components/AssetManager';
import AudioManager from './components/AudioManager';
import CanvasRenderer from './components/CanvasRenderer';

export {
  GameObject,
  Component,
  AnimationManager,
  AssetManager,
  Physical,
  AudioManager,
  Sprite,
  SpriteSheet,
  CanvasRenderer,
}

interface CreateGameOpts {
  rootComponents: Component<any>[],
  canvas: HTMLCanvasElement,
  width: number;
  height: number;
  backgroundColor?: string;
}

export function createGame(opts: CreateGameOpts) {
  const game = new Game(opts.rootComponents);

  return game.run(opts);
}
