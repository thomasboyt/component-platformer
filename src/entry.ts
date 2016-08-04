import {createPearl, AssetManager, AudioManager} from 'pearl';

import GameManager from './components/GameManager';
import assets from './assets';
import {palette} from './constants';

createPearl({
  rootComponents: [
    // XXX: AudioManager has to be created BEFORE AssetManager so AssetManager can use its
    // AudioContext
    new AudioManager({
      defaultGain: 0.5
    }),
    new AssetManager(assets),
    new GameManager(),
  ],

  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  width: 400,
  height: 400,
  backgroundColor: palette.darker,
});