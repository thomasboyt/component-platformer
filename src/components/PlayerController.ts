import * as Pearl from 'pearl';
import {Component, GameObject, Physical, AnimationManager, CanvasRenderer} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';
import BulletController from './BulletController';
import * as Tags from '../Tags';

export default class PlayerController extends Component<{}> {
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

        // TODO: this is a bad place for this
        new CanvasRenderer({
          renderFn: (obj: GameObject, ctx: CanvasRenderingContext2D) => {
            const phys = obj.getComponent(Physical);
            ctx.fillStyle = 'red';

            ctx.fillRect(
              phys.center.x - phys.size.x / 2,
              phys.center.y - phys.size.y / 2,
              phys.size.x,
              phys.size.y);
          },
        }),
      ],
    });

    this.game.entities.add(bullet, null);
  }

  collision(other: GameObject) {
    if (other.hasTag(Tags.enemy)) {
      this.game.entities.destroy(this.gameObject);
    }
  }
}
