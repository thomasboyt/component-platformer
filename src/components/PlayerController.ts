import {
  Component,
  GameObject,
  Physical,
  AnimationManager,
  PolygonCollider,
  Keys,
  AudioManager,
} from 'pearl';

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

  world!: GameObject;

  init(opts: Options) {
    this.world = opts.world;
  }

  update(dt: number) {
    // XXX: testEnemyCollision needs to happen first since it sets the player state to "dead,"
    // preventing the rest of this update hook from running
    this.testEnemyCollision();

    if (this.state === PlayerState.dead) {
      return;
    }

    const physical = this.getComponent(Physical);
    const poly = this.getComponent(PolygonCollider);
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
        this.jump();
      }
    }

    if (this.pearl.inputter.isKeyPressed(Keys.shift)) {
      this.shoot();
    }
  }

  died() {
    if (this.state === PlayerState.dead) {
      return;
    }

    this.getComponent(Physical).frozen = true;
    this.state = PlayerState.dead;
  }

  private jump() {
    const physical = this.getComponent(Physical);
    physical.vel.y = -this.jumpSpeed;

    this.pearl.obj.getComponent(AudioManager).play('jump');
  }

  private shoot() {
    this.pearl.obj.getComponent(AudioManager).play('shoot');

    const bullet = this.pearl.entities.add(new GameObject({
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

  private testEnemyCollision() {
    if (this.state === PlayerState.dead) {
      return;
    }

    const enemies = [...this.world.children].filter((entity) => entity.hasTag(Tags.enemy));

    const phys = this.getComponent(Physical);

    for (let enemy of enemies) {
      const selfPoly = this.getComponent(PolygonCollider);
      const otherPoly = enemy.getComponent(PolygonCollider);

      if (selfPoly.isColliding(otherPoly)) {
        this.onEnemyCollision();
        return;
      }
    }
  }

  private onEnemyCollision() {
    this.getComponent(AnimationManager).set('dead');

    this.died();

    this.runCoroutine(function* (this: PlayerController) {
      yield this.pearl.async.waitMs(3000);

      this.pearl.obj.getComponent(GameManager).playerDied();
    });
  }
}
