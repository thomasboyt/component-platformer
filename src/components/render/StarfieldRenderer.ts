import {Component} from 'pearl-component-shim';
import {randInt} from '../../util/math';
import {palette} from '../../constants';

interface Star {
  x: number;
  y: number;
  ty: number;
};

export default class StarfieldRenderer extends Component<{}> {
  starfield: Star[];

  height: number = 400;
  width: number = 400;

  gridSize: number = 80;

  init() {
    const gridSize = this.gridSize;

    const numStars = (this.height / gridSize) * (this.width / gridSize);

    this.starfield = [];
    for (let n = 0; n < numStars; n += 1) {
      const tx = (n % (this.width / gridSize)) * gridSize;
      const ty = (Math.floor(n / (this.width / gridSize))) * gridSize;

      const x = randInt(tx, tx + gridSize);
      const y = randInt(ty, ty + gridSize);

      this.starfield.push({x, y, ty});
    }
  }

  update(dt: number) {
    // Move stars
    const starSpeed = dt/100 * 6;

    for (var i = this.starfield.length - 1; i >= 0; i--) {
      const star = this.starfield[i];
      star.x -= starSpeed;

      if (star.x < -5) {
        // Move star to other end of field
        star.x = randInt(this.width, this.width + this.gridSize);
        star.y = randInt(star.ty, star.ty + this.gridSize);
      }
    }

  }

  render(ctx: CanvasRenderingContext2D) {
    // draw background
    ctx.fillStyle = palette.darker;
    ctx.fillRect(0, 0, this.width, this.height);

    // draw starfield
    ctx.fillStyle = palette.lighter;
    this.starfield.forEach((star) => {
      ctx.fillRect(star.x, star.y, 5, 5);
    });

  }
}
