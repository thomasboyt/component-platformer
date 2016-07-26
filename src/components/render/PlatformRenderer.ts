import {Component, Physical} from '../../shim';

export default class PlatformRenderer extends Component<{}> {
  render(ctx: CanvasRenderingContext2D) {
    const phys = this.getComponent(Physical);

    ctx.fillStyle = 'white';
    ctx.fillRect(phys.center.x - phys.size.x / 2,
                 phys.center.y - phys.size.y / 2,
                 phys.size.x,
                 phys.size.y);
  }
}