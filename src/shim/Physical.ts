import * as Pearl from 'pearl';
import GameObject from './GameObject';
import Component from './Component';

export interface PhysicalSettings {
  center?: Pearl.Coordinates;
  size?: Pearl.Coordinates;
}

export default class Physical extends Component {
  center: Pearl.Coordinates;
  size: Pearl.Coordinates;
  angle: number;
  boundingBox: Pearl.BoundingBox = Pearl.BoundingBox.Rectangle;

  // TODO: This maybe belongs somewhere else? Especially if it's going to be this generic?
  vel: Pearl.Coordinates = {
    x: 0,
    y: 0,
  };

  constructor(settings: PhysicalSettings = {}) {
    super();

    if (settings.center) {
      this.center = settings.center;
    }
    if (settings.size) {
      this.center = settings.size;
    }
  }

  update(self: GameObject, dt: number) {
    this.center.x += this.vel.x * dt;
    this.center.y += this.vel.y * dt;
  }
}
