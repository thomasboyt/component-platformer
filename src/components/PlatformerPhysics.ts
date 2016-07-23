import * as Pearl from 'pearl';
import {Component, GameObject, Physical} from '../shim';
import GameManager from './GameManager';
import {rectangleIntersection} from '../util/math';

export const BLOCK_TAG = 'Block';

export default class PlatformerPhysics extends Component {
  grounded: boolean = false;

  update(dt: number) {
    const physical = this.getComponent(Physical);

    if (physical.vel.y !== 0) {
      this.grounded = false;
    }

    physical.vel.y += this.game.obj.getComponent(GameManager).gravityAccel * dt;
  }

  collision(other: GameObject) {
    const phys = this.getComponent(Physical);
    const plat = this.getComponent(PlatformerPhysics);

    if (other.hasTag(BLOCK_TAG)) {
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
            plat.grounded = true;
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
    }
  }
}
