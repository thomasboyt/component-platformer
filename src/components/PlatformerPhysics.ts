import * as Pearl from 'pearl';
import {Component, GameObject, Physical} from 'pearl-component-shim';
import GameManager from './GameManager';
import {rectangleIntersection, Intersection} from '../util/math';

import * as Tags from '../Tags';

interface Listener<T> {
  (data: T): void;
}

class Delegate<T> {
  private listeners: Set<Listener<T>> = new Set();

  add(fn: Listener<T>) {
    this.listeners.add(fn);
  }

  remove(fn: Listener<T>) {
    this.listeners.delete(fn);
  }

  call(data: T) {
    this.listeners.forEach((fn: Listener<T>) => {
      fn(data);
    });
  }
}

export default class PlatformerPhysics extends Component<{}> {
  grounded: boolean = false;

  afterBlockCollision: Delegate<Intersection> = new Delegate<Intersection>();

  update(dt: number) {
    const physical = this.getComponent(Physical);

    if (physical.vel.y !== 0) {
      this.grounded = false;
    }

    physical.vel.y += this.pearl.obj.getComponent(GameManager).gravityAccel * dt;
  }

  collision(other: GameObject) {
    const phys = this.getComponent(Physical);

    if (other.hasTag(Tags.block)) {
      const intersect = rectangleIntersection(
        phys,
        other.getComponent(Physical)
      );

      if (intersect.w > intersect.h) {

        // Self is falling into a block from above
        if (intersect.fromAbove) {
          phys.center.y -= intersect.h;

          if (phys.vel.y > 0) {
            phys.vel.y = 0;
            this.grounded = true;
          }

        // Self is rising into a block from below
        } else {
          phys.center.y += intersect.h;

          if (phys.vel.y < 0) {
            phys.vel.y = 0;
          }
        }

      } else {
        // Self is colliding with the block from the left
        if (intersect.fromLeft) {
          phys.center.x -= intersect.w;

        // Self is colliding with the block from the right
        } else {
          phys.center.x += intersect.w;
        }
      }

      this.afterBlockCollision.call(intersect);
    }
  }
}
