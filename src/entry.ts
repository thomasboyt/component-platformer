import Game from './Game';

const game = new Game();

game.run({
  canvas: document.getElementById('canvas') as HTMLCanvasElement,
  width: 640,
  height: 480,
  backgroundColor: 'black',
});