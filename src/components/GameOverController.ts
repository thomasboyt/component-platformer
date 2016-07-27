import * as Pearl from 'pearl';
import {Component} from '../shim';

interface Options {
  onRestart: () => void;
}

export default class GameOverController extends Component<Options> {
  private handleRestart: () => void;

  init(opts: Options) {
    this.handleRestart = opts.onRestart;
  }

  update(dt: number) {
    if (this.pearl.inputter.isKeyPressed(Pearl.Keys.r)) {
      this.handleRestart();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#CEE682';

    ctx.textAlign = 'center';

    ctx.font = '40px "Press Start 2P"';
    ctx.fillText('Game Over', 210, 150);

    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('press R to restart', 200, 250);
  }
}