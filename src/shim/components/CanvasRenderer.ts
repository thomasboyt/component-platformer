import Component from '../Component';
import GameObject from '../GameObject';

export type renderFn = (obj: GameObject, ctx: CanvasRenderingContext2D) => void;

interface Options {
  renderFn: renderFn;
}

export default class CanvasRenderer extends Component<Options> {
  private renderFn: renderFn;

  init(opts: Options) {
    this.renderFn = opts.renderFn;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderFn(this.gameObject, ctx);
  }
}
