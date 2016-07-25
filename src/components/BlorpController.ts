import * as Pearl from 'pearl';
import {Component, GameObject, Physical, AnimationManager} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';
import GameManager from './GameManager';

export default class BlorpController extends Component {
  walkSpeed: number = 5 / 100;
  jumpSpeed: number = 2 / 10;
  walkingRight: boolean = true;

  update(dt: number) {
    const phys = this.getComponent(Physical);
    const platformerPhysics = this.getComponent(PlatformerPhysics);
    const anim = this.getComponent(AnimationManager);

    let walkDirection = this.walkingRight ? 1 : -1;

    const player = this.game.obj.getComponent(GameManager).player;
    const playerCenter = player.getComponent(Physical).center;

    if (player) {
      const xDiff = playerCenter.x - phys.center.x;
      const yDiff = playerCenter.y - phys.center.y;

      // if (Math.abs(xDiff) < 60 && Math.abs(yDiff) < 25) {
      walkDirection = xDiff > 0 ? 1 : -1;
      anim.setScale(walkDirection, 1);
      // }
    }

    phys.vel.x = walkDirection * this.walkSpeed;

    if (phys.vel.x && platformerPhysics.grounded) {
      anim.set('walk');
    } else {
      anim.set('stand');
    }
  }

  collision(other: GameObject) {
  }
}