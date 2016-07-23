import * as Pearl from 'pearl';
import {Component, GameObject, Physical} from '../shim';

export default class PlatformerPhysics extends Component {
  grounded: boolean = false;

  update(self: GameObject, dt: number) {
    const physical = self.getComponent(Physical);

    if (physical.vel.y !== 0) {
      this.grounded = false;
    }

    // TODO: Obviously getGame() doesn't exist. What will a good way to look up the gravity be?
    // Maybe something like self.getComponentByTag("gameController") ?
    physical.vel.y += self.getGame().gravityAccel;
  }

  collision(self: GameObject, other: GameObject) {
    const phys = self.getComponent(Physical);
    const plat = self.getComponent(PlatformerPhysics);

    // Should this use some sort of tagging system?
    if (self instanceof Block) {
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
