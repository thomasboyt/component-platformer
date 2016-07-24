import Component from '../Component';
import GameObject from '../GameObject';

export type renderFn = (obj: GameObject, ctx: CanvasRenderingContext2D) => void;

export default class CanvasRenderer extends Component {
  private renderFn: renderFn;

  constructor(renderFn: renderFn) {
    super();
    this.renderFn = renderFn;
  }

  render(ctx: CanvasRenderingContext2D) {
    this.renderFn(this.gameObject, ctx);
  }
}
