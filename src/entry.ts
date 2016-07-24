import GameManager from './components/GameManager';

import assets from './assets';

import {createGame, AssetManager, AudioManager} from './shim';

createGame({
  rootComponents: [
    new AssetManager(assets),
    new AudioManager(1),
    new GameManager(),
  ],

  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  width: 640,
  height: 480,
  backgroundColor: 'black',
});