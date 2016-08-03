import {createPearl, AssetManager, AudioManager} from 'pearl';

import GameManager from './components/GameManager';
import assets from './assets';
import {palette} from './constants';

createPearl({
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