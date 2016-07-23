import * as Pearl from 'pearl';
import {Component, GameObject, Physical} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';
import AnimationManager from './AnimationManager';

export default class PlayerController extends Component {
  walkSpeed: number = 5 / 100;
  jumpSpeed: number = 2 / 100;
  facingRight: boolean = true;

  update(dt: number) {
    const physical = this.getComponent(Physical);
    const platformerPhysics = this.getComponent(PlatformerPhysics);
    const anim = this.getComponent(AnimationManager);

    if (this.game.inputter.isKeyDown(Pearl.Keys.leftArrow)) {
      physical.vel.x = -this.walkSpeed;
      anim.set('walk');
      this.facingRight = false;

    } else if (this.game.inputter.isKeyDown(Pearl.Keys.rightArrow)) {
      physical.vel.x = this.walkSpeed;
      anim.set('walk');
      this.facingRight = true;

    } else {
      // TODO: this should maybe use other stuff
      physical.vel.x = 0;
      anim.set('stand');
    }

    if (this.game.inputter.isKeyPressed(Pearl.Keys.space) && platformerPhysics.grounded) {
      physical.vel.y = -this.jumpSpeed * dt;
    }
  }
}
