import {Component, GameObject, Physical, AnimationManager, CollisionResponse, PolygonCollider} from 'pearl';

import PlatformerPhysics from './PlatformerPhysics';
import WorldManager from './WorldManager';

import * as Tags from '../Tags';

interface Options {
  platform: GameObject;
}

export default class BlorpController extends Component<Options> {
  private platform!: GameObject;

  walkSpeed: number = 5 / 100;
  jumpSpeed: number = 2 / 10;
  walkingRight: boolean = true;

  init(opts: Options) {
    this.platform = opts.platform;

    const plat = this.getComponent(PlatformerPhysics);
    plat.afterBlockCollision.add(this.afterBlockCollision);
  }

  onDestroy() {
    const plat = this.getComponent(PlatformerPhysics);
    plat.afterBlockCollision.remove(this.afterBlockCollision);
  }

  getPatrolBounds(): [number, number] {
    const platformX = this.platform.getComponent(Physical).center.x;
    const platformWidth = this.platform.getComponent(PolygonCollider).width!;

    return [platformX - platformWidth / 2, platformX + platformWidth / 2];
  }

  update(dt: number) {
    const phys = this.getComponent(Physical);

    const platformerPhysics = this.getComponent(PlatformerPhysics);
    const anim = this.getComponent(AnimationManager);

    const patrolBounds = this.getPatrolBounds();
    if (phys.center.x > patrolBounds[1]) {
      this.walkingRight = false;
    } else if (phys.center.x < patrolBounds[0]) {
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