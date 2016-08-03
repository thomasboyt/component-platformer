import {Component, GameObject, Physical, AnimationManager, Keys} from 'pearl';

import PlatformerPhysics from './PlatformerPhysics';
import BulletController from './BulletController';
import GameManager from './GameManager';
import WorldManager from './WorldManager';

import * as Tags from '../Tags';

enum PlayerState {
  alive,
  dead,
}

interface Options {
  world: GameObject;
}

export default class PlayerController extends Component<Options> {
  walkSpeed: number = 10 / 100;
  jumpSpeed: number = 3 / 10;
  facingLeft: boolean = true;
  state: PlayerState = PlayerState.alive;

  didDoubleJump: boolean = false;

  world: GameObject;

  init(opts: Options) {
    this.world = opts.world;
  }

  update(dt: number) {
    if (this.state === PlayerState.dead) {
      return;
    }

    const physical = this.getComponent(Physical);
    const platformerPhysics = this.getComponent(PlatformerPhysics);
    const anim = this.getComponent(AnimationManager);

    if (this.pearl.inputter.isKeyDown(Keys.leftArrow) ||
        this.pearl.inputter.isKeyDown(Keys.a)) {
      physical.vel.x = -this.walkSpeed;
      anim.set('walk');
      this.facingLeft = true;
      anim.setScale(-1, 1);

    } else if (this.pearl.inputter.isKeyDown(Keys.rightArrow) ||
        this.pearl.inputter.isKeyDown(Keys.d)) {
      physical.vel.x = this.walkSpeed;
      anim.set('walk');
      this.facingLeft = false;
      anim.setScale(1, 1);

    } else {
      physical.vel.x = 0;
      anim.set('stand');
    }

    if (this.pearl.inputter.isKeyPressed(Keys.space)) {
      let allowJump: boolean = false;

      if (platformerPhysics.grounded) {
        this.didDoubleJump = false;
        allowJump = true;
      } else if (!this.didDoubleJump) {
        this.didDoubleJump = true;
        allowJump = true;
      }

      if (allowJump) {
        physical.vel.y = -this.jumpSpeed;
      }
    }

    if (this.pearl.inputter.isKeyPressed(Keys.shift)) {
      this.shoot();
    }

    if (physical.center.y > this.world.getComponent(WorldManager).height + physical.size.y / 2) {
      this.state = PlayerState.dead;
      this.pearl.obj.getComponent(GameManager).playerDied();
    }
  }

  private shoot() {
    this.gameObject.addChild(new GameObject({
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
    }));
  }

  collision(other: GameObject) {
    if (this.state === PlayerState.dead) {
      return;
    }

    if (other.hasTag(Tags.enemy)) {
      this.getComponent(AnimationManager).set('dead');

      this.pearl.async.schedule(function* (this: PlayerController) {
        this.state = PlayerState.dead;
        this.getComponent(Physical).frozen = true;

        yield this.pearl.async.waitMs(3000);

        this.pearl.obj.getComponent(GameManager).playerDied();
      }.bind(this));
    }
  }
}
