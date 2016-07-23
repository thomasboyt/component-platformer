import * as Pearl from 'pearl';
import {Component, GameObject} from '../GameObject';

export default class Physical extends Component {
  center: Pearl.Coordinates;
  size: Pearl.Coordinates;
  angle: number;
  vel: Pearl.Coordinates;

  update(self: GameObject, dt: number) {
    this.center.x += this.vel.x * dt;
    this.center.y += this.vel.y * dt;
  }
}
