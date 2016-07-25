import * as Pearl from 'pearl';
import {Component, GameObject, Physical, AnimationManager} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';

export default class PlayerController extends Component {
  walkSpeed: number = 5 / 100;
  jumpSpeed: number = 3 / 10;
  facingLeft: boolean = true;

  update(dt: number) {
    const physical = this.getComponent(Physical);
    const platformerPhysics = this.getComponent(PlatformerPhysics);
    const anim = this.getComponent(AnimationManager);

    if (this.game.inputter.isKeyDown(Pearl.Keys.leftArrow)) {
      physical.vel.x = -this.walkSpeed;
      anim.set('walk');
      this.facingLeft = false;
      anim.setScale(-1, 1);

    } else if (this.game.inputter.isKeyDown(Pearl.Keys.rightArrow)) {
      physical.vel.x = this.walkSpeed;
      anim.set('walk');
      this.facingLeft = true;
      anim.setScale(1, 1);

    } else {
      physical.vel.x = 0;
      anim.set('stand');
    }

    if (this.game.inputter.isKeyPressed(Pearl.Keys.space) && platformerPhysics.grounded) {
      physical.vel.y = -this.jumpSpeed;
    }
  }
}
