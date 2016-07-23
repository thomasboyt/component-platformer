import GameManager from './components/GameManager';
import AssetManager from './components/AssetManager';
import AudioManager from './components/AudioManager';

import assets from './assets';

import {createGame} from './shim';

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