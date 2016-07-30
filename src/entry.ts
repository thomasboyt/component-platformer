import GameManager from './components/GameManager';

import assets from './assets';

import {createGame, AssetManager, AudioManager} from 'pearl-component-shim';
import {palette} from './constants';

createGame({
  rootComponents: [
    new AssetManager(assets),
    new AudioManager({
      defaultGain: 1
    }),
    new GameManager(),
  ],

  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  width: 400,
  height: 400,
  backgroundColor: palette.darker,
});