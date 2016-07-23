import * as Pearl from 'pearl';

import {Component, GameObject, Physical} from '../shim';

import AnimationManager from './AnimationManager';
import PlatformerPhysics, {BLOCK_TAG} from './PlatformerPhysics';
import PlayerController from './PlayerController';
import SpriteSheet from '../util/SpriteSheet';

import AssetManager from './AssetManager';

function renderPlayer(obj: GameObject, ctx: CanvasRenderingContext2D) {
  const phys = obj.getComponent(Physical);
  const anim = obj.getComponent(AnimationManager);
  const player = obj.getComponent(PlayerController);

  const sprite = anim.getSprite();

  let destX = phys.center.x - sprite.width / 2;
  const destY = phys.center.y - sprite.height / 2;

  if (!player.facingRight) {
    ctx.scale(-1, 1);
    destX = (destX * -1) - sprite.width;
  }

  sprite.draw(ctx, destX, destY);
}

function renderPlatform(obj: GameObject, ctx: CanvasRenderingContext2D) {
  const phys = obj.getComponent(Physical);

  ctx.fillStyle = 'white';
  ctx.fillRect(phys.center.x - phys.size.x / 2,
               phys.center.y - phys.size.y / 2,
               phys.size.x,
               phys.size.y);
}

export default class GameManager extends Component {
  gravityAccel: number = (5 / 10000);

  init() {
    const assetManager = this.getComponent(AssetManager);

    assetManager.load().then(() => {
      this.createWorld();
    });
  }

  createWorld() {
    const playerSheetImg = this.getComponent(AssetManager).assets.images['playerSheet'];
    const playerSheet = new SpriteSheet(playerSheetImg, 20, 20);

    const player = new GameObject({
      // name is used for debug display and maybe lookups in the future?
      name: 'Player',

      components: [
        // add positioning to the world and make collidable
        new Physical({
          center: {
            x: 300,
            y: 5,
          },
          size: {
            x: 11,
            y: 20,
          }
        }),
        // add controls to allow player to move left/right and jump
        new PlayerController(),

        // add platformer physics to apply gravity and collision with platforms
        new PlatformerPhysics(),

        new AnimationManager(playerSheet, 'stand', {
          stand: {
            frames: [0],
            frameLengthMs: null,
          },
          walk: {
            frames: [1, 0],
            frameLengthMs: 200,
          }
        })
      ],

      render: renderPlayer,

      // tags could be used in the future to allow lookups of specific instances of things
      // tag: ['player'],

      // might be useful to be able to specify zIndex here, too?
      // zIndex: 0,
    });

    const platform = new GameObject({
      name: 'Platform',

      tags: [BLOCK_TAG],

      components: [
        new Physical({
          center: {
            x: 300,
            y: 300,
          },
          size: {
            x: 500,
            y: 25,
          },
        })
      ],

      render: renderPlatform,
    })

    // TODO: Abstract this away somewhere!!
    // createGameObject() factory?
    this.game.entities.add(player, null);

    this.game.entities.add(platform, null);
  }
}
