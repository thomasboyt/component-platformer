import * as Pearl from 'pearl';
import {Component, GameObject, Physical} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';

export default class PlayerController extends Component {
  walkSpeed: number = 5;
  jumpSpeed: number = 5;

  update(obj: GameObject, dt: number) {
    const physical = obj.getComponent(Physical);
    const platformerPhysics = obj.getComponent(PlatformerPhysics);

    if (obj.game.inputter.isKeyDown(Pearl.Keys.leftArrow)) {
      physical.vel.x = -this.walkSpeed;
    } else if (obj.game.inputter.isKeyDown(Pearl.Keys.rightArrow)) {
      physical.vel.x = this.walkSpeed;
    }

    if (obj.game.inputter.isKeyPressed(Pearl.Keys.space) && platformerPhysics.grounded) {
      physical.vel.y = -this.jumpSpeed;
    }
  }
}
