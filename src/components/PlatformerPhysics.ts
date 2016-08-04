import {Component, GameObject, Physical, PolygonCollider, CollisionResponse} from 'pearl';
import GameManager from './GameManager';

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

interface Options {
  world: GameObject;
}

export default class PlatformerPhysics extends Component<Options> {
  world: GameObject;

  grounded: boolean = false;

  afterBlockCollision: Delegate<CollisionResponse> = new Delegate<CollisionResponse>();

  init(opts: Options) {
    this.world = opts.world;
  }

  update(dt: number) {
    this.testPlatformCollisions();

    const physical = this.getComponent(Physical);

    if (physical.vel.y !== 0) {
      this.grounded = false;
    }

    physical.vel.y += this.pearl.obj.getComponent(GameManager).gravityAccel * dt;
  }

  private testPlatformCollisions() {
    const blocks = [...this.world.children].filter((entity) => entity.hasTag(Tags.block));

    const phys = this.getComponent(Physical);

    for (let block of blocks) {
      const selfPoly = this.getComponent(PolygonCollider);
      const otherPoly = block.getComponent(PolygonCollider);

      const collision = selfPoly.getCollision(otherPoly);
      if (collision) {
        this.resolvePlatformCollision(collision);
      }
    }
  }

  private resolvePlatformCollision(collision: CollisionResponse) {
    const phys = this.getComponent(Physical);
    const vec = collision.overlapVector;

    if (Math.abs(vec[1]) > Math.abs(vec[0])) {
      phys.center.y -= vec[1];

      // Self is falling into a block from above
      if (vec[1] > 0) {
        if (phys.vel.y > 0) {
          phys.vel.y = 0;
          this.grounded = true;
        }

      // Self is rising into a block from below
      } else {
        if (phys.vel.y < 0) {
          phys.vel.y = 0;
        }
      }

    } else {
      // Self is colliding with the block from the left or right
      phys.center.x -= vec[0];
    }

    this.afterBlockCollision.call(collision);
  }
}
