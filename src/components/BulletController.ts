import {Component, GameObject, Physical} from '../shim';

interface Opts {
  direction: 'left' | 'right' | 'up' | 'down',
  creator: GameObject,
}

export default class BulletController extends Component<Opts> {
  bulletSpeed: number = 1 / 10;

  init(opts: Opts) {
    const phys = this.getComponent(Physical);

    phys.size = {
      x: 2,
      y: 2,
    };

    let vec: [number, number];
    if (opts.direction === 'left') {
      vec = [1, 0];
    } else if (opts.direction === 'right') {
      vec = [-1, 0];
    } else if (opts.direction === 'up') {
      vec = [0, -1];
    } else if (opts.direction === 'down') {
      vec = [0, 1];
    } else {
      throw new Error(`invalid bullet direction ${opts.direction}`);
    }

    phys.vel.x = vec[0] * this.bulletSpeed;
    phys.vel.y = vec[1] * this.bulletSpeed;

    const parentPhys = opts.creator.getComponent(Physical);

    const offsetX = parentPhys.size.x / 2 + phys.size.x / 2;
    const offsetY = parentPhys.size.y / 2 + phys.size.y / 2;

    phys.center = {
      x: parentPhys.center.x + (vec[0] * offsetX),
      y: parentPhys.center.y + (vec[1] * offsetY),
    };
  }

  update(dt: number) {
    // TODO: Detect if bullet goes off screen and destroy if so
  }
}