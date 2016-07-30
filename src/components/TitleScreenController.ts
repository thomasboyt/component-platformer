import * as Pearl from 'pearl';
import {Component} from 'pearl-component-shim';

interface Options {
  onAdvance: () => void;
}

export default class TitleScreenController extends Component<Options> {
  private handleAdvanceTitle: () => void;

  init(opts: Options) {
    this.handleAdvanceTitle = opts.onAdvance;
  }

  update(dt: number) {
    if (this.pearl.inputter.isKeyPressed(Pearl.Keys.space)) {
      this.handleAdvanceTitle();
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#CEE682';

    ctx.textAlign = 'center';

    ctx.font = '40px "Press Start 2P"';
    ctx.fillText('BLORP', 210, 150);

    ctx.font = '16px "Press Start 2P"';
    ctx.fillText('a demo game', 210, 180);

    const offset = 250;

    ctx.fillText('arrows move', 200, offset);
    ctx.fillText('space jumps', 200, offset + 20);
    ctx.fillText('shift shoots', 200, offset + 40);
    ctx.fillText("press space to start", 200, offset +  80);
  }
}