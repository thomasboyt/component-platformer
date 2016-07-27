import * as Pearl from 'pearl';
import {Component, GameObject, Physical, AnimationManager} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';
import BulletController from './BulletController';
import GameManager from './GameManager';
import WorldManager from './WorldManager';

import * as Tags from '../Tags';

enum PlayerState {
  alive,
  dead,
}

export default class PlayerController extends Component<{}> {
  walkSpeed: number = 5 / 100;
  jumpSpeed: number = 3 / 10;
  facingLeft: boolean = true;

  state: PlayerState = PlayerState.alive;

  update(dt: number) {
    if (this.state === PlayerState.dead) {
      return;
    }

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

    if (this.game.inputter.isKeyPressed(Pearl.Keys.shift)) {
      this.shoot();
    }
  }

  private shoot() {
    const bullet = new GameObject({
      name: 'Bullet',

      tags: [Tags.bullet],

      components: [
        // initial location will be filled in by BulletController
        new Physical(),

        new BulletController({
          creator: this.gameObject,
          direction: this.facingLeft ? 'left' : 'right',
        }),
      ],
    });

    this.game.entities.add(bullet, null);
  }

  collision(other: GameObject) {
    if (this.state === PlayerState.dead) {
      return;
    }

    if (other.hasTag(Tags.enemy)) {
      this.getComponent(AnimationManager).set('dead');

      this.game.async.schedule(function* (this: PlayerController) {
        this.state = PlayerState.dead;
        yield this.game.async.waitMs(3000);
        this.game.obj.getComponent(GameManager).playerDied();
      }.bind(this));
    }
  }
}
