import * as Pearl from 'pearl';
import {Component, GameObject, Physical, AnimationManager} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';
import {Intersection} from '../util/math';
import WorldManager from './WorldManager';

import * as Tags from '../Tags';

interface Options {
  world: GameObject;
  patrolBounds: [number, number]
}

export default class BlorpController extends Component<Options> {
  private world: GameObject;
  patrolBounds: [number, number]

  walkSpeed: number = 5 / 100;
  jumpSpeed: number = 2 / 10;
  walkingRight: boolean = true;

  init(opts: Options) {
    this.world = opts.world;
    this.patrolBounds = opts.patrolBounds;

    const plat = this.getComponent(PlatformerPhysics);
    plat.afterBlockCollision.add(this.afterBlockCollision);
  }

  onDestroy() {
    const plat = this.getComponent(PlatformerPhysics);
    plat.afterBlockCollision.remove(this.afterBlockCollision);
  }

  update(dt: number) {
    const phys = this.getComponent(Physical);
    const world = this.world.getComponent(WorldManager);

    // if (phys.center.x > world.width + phys.size.x / 2 ||
    //     phys.center.y > world.height + phys.size.y / 2 ||
    //     phys.center.x - phys.size.x / 2 < 0 ||
    //     phys.center.y - phys.size.y / 2 < 0) {
    //   // offscreen, destroy this!
    //   this.pearl.entities.destroy(this.gameObject);
    // }

    const platformerPhysics = this.getComponent(PlatformerPhysics);
    const anim = this.getComponent(AnimationManager);

    // follow player if they're on the same general y range and within the patrol boundaries
    const player = this.world.getComponent(WorldManager).player!;
    const playerCenter = player.getComponent(Physical).center;

    const xDiff = playerCenter.x - phys.center.x;
    const yDiff = playerCenter.y - phys.center.y;

    if (playerCenter.x >= this.patrolBounds[0] &&
        playerCenter.y <= this.patrolBounds[1] &&
        Math.abs(yDiff) < 20) {
      this.walkingRight = xDiff > 0;

    } else {
      if (phys.center.x > this.patrolBounds[1]) {
        this.walkingRight = false;
      } else if (phys.center.x < this.patrolBounds[0]) {
        this.walkingRight = true;
      }
    }

    const walkDirection = this.walkingRight ? 1 : -1;
    phys.vel.x = walkDirection * this.walkSpeed;

    if (phys.vel.x && platformerPhysics.grounded) {
      anim.set('walk');
    } else {
      anim.set('stand');
    }
  }

  collision(other: GameObject) {
    if (other.hasTag(Tags.bullet)) {
      this.pearl.entities.destroy(this.gameObject);
      this.pearl.entities.destroy(other);
    }
  }

  afterBlockCollision = (intersect: Intersection) => {
    if (intersect.h > intersect.w) {
      if (intersect.fromLeft) {
        this.walkingRight = false;
      } else {
        this.walkingRight = true;
      }
    }
  }
}