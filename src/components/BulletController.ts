import {Component, GameObject, Physical, PolygonCollider} from 'pearl';
import {palette} from '../constants';

import * as Tags from '../Tags';

interface Opts {
  direction: 'left' | 'right' | 'up' | 'down',
  creator: GameObject,
}

export default class BulletController extends Component<Opts> {
  bulletSpeed: number = 1 / 10;

  width: number = 5;
  height: number = 2;

  init(opts: Opts) {
    const phys = this.getComponent(Physical);

    let vec: [number, number];
    if (opts.direction === 'left') {
      vec = [-1, 0];
    } else if (opts.direction === 'right') {
      vec = [1, 0];
    } else if (opts.direction === 'up') {
      vec = [0, -1];
    } else if (opts.direction === 'down') {
      vec = [0, 1];
    } else {
      throw new Error(`invalid bullet direction ${opts.direction}`);
    }

    phys.vel.x = vec[0] * this.bulletSpeed;
    phys.vel.y = vec[1] * this.bulletSpeed;

    const parentPoly = opts.creator.getComponent(PolygonCollider);
    const parentPhys = opts.creator.getComponent(Physical);

    const offsetX = (parentPoly.width!) / 2 + (this.width!) / 2;
    const offsetY = (parentPoly.height!) / 2 + (this.height!) / 2;

    phys.center = {
      x: parentPhys.center.x + (vec[0] * offsetX),
      y: parentPhys.center.y + (vec[1] * offsetY),
    };
  }

  update(dt: number) {
    // Raytrace bullet against all enemies in scene, destroying enemies on collision
    const phys = this.getComponent(Physical);

    const enemies = [...this.pearl.entities.all()].filter((entity) => entity.hasTag(Tags.enemy));
    const vec: [[number, number], [number, number]] = [
      [phys.center.x, phys.center.y],
      [phys.center.x + phys.vel.x * dt, phys.center.y + phys.vel.y * dt],
    ];

    for (let enemy of enemies) {
      const poly = enemy.getComponent(PolygonCollider);

      if (poly.segmentIntersects(vec, dt)) {
        this.pearl.entities.destroy(this.gameObject);
        this.pearl.entities.destroy(enemy);
      }
    }
  }

  render(ctx: CanvasRenderingContext2D) {
    const phys = this.getComponent(Physical);
    ctx.fillStyle = palette.lighter;

    ctx.fillRect(
      phys.center.x - this.width / 2,
      phys.center.y - this.height / 2,
      this.width,
      this.height);
  }
}