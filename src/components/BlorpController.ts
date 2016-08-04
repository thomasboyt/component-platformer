import {Component, GameObject, Physical, AnimationManager, CollisionResponse} from 'pearl';

import PlatformerPhysics from './PlatformerPhysics';
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
    if (phys.center.x > this.patrolBounds[1]) {
      this.walkingRight = false;
    } else if (phys.center.x < this.patrolBounds[0]) {
      this.walkingRight = true;
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

  afterBlockCollision = (resp: CollisionResponse) => {
    const vec = resp.overlapVector;

    if (Math.abs(vec[0]) > Math.abs(vec[1])) {
      if (vec[0] > 0) {
        this.walkingRight = false;
      } else {
        this.walkingRight = true;
      }
    }
  }
}