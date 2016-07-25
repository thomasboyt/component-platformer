import * as Pearl from 'pearl';

import {
  GameObject,
  Component,
  Physical,
  AnimationManager,
  AssetManager,
  SpriteSheet,
  CanvasRenderer,
} from '../shim';

import PlatformerPhysics from './PlatformerPhysics';
import PlayerController from './PlayerController';
import BlorpController from './BlorpController';

import * as Tags from '../Tags';

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

  player: GameObject;

  blorpSheet: SpriteSheet;

  init() {
    const assetManager = this.getComponent(AssetManager);

    assetManager.load().then(() => {
      const blorpSheetImg = this.getComponent(AssetManager).getImage('blorpSheet');
      this.blorpSheet = new SpriteSheet(blorpSheetImg, 13, 13);

      this.createWorld();
    });
  }

  createWorld() {
    const playerSheetImg = this.getComponent(AssetManager).getImage('playerSheet');
    const playerSheet = new SpriteSheet(playerSheetImg, 20, 20);

    // 400 x 400
    this.createPlatform(0, 0, 20, 400);
    this.createPlatform(380, 0, 20, 400);

    this.createPlatform(150, 80, 100, 20);
    this.createPlatform(200, 170, 180, 20);
    this.createPlatform(50, 230, 125, 20);
    this.createPlatform(150, 290, 100, 20);
    this.createPlatform(20, 370, 100, 20);
    this.createPlatform(280, 370, 100, 20);

    this.createBlorp(200, 70);

    this.player = new GameObject({
      // name is used for debug display and maybe lookups in the future?
      name: 'Player',

      components: [
        // add positioning to the world and make collidable
        new Physical({
          center: {
            x: 50,
            y: 360,
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

      // might be useful to be able to specify zIndex here, too?
      // zIndex: 0,
    });


    // TODO: Abstract this away somewhere!!
    // createGameObject() factory?
    this.game.entities.add(this.player, null);
  }

  private createPlatform(x: number, y: number, width: number, height: number) {
    const cx = x + width / 2;
    const cy = y + height / 2;

    const platform = new GameObject({
      name: 'Platform',

      tags: [Tags.block],

      components: [
        new Physical({
          center: {
            x: cx,
            y: cy,
          },
          size: {
            x: width,
            y: height,
          },
        }),

        new CanvasRenderer(renderPlatform),
      ],
    });

    this.game.entities.add(platform, null);
  }

  private createBlorp(x: number, y: number) {
    const blorp = new GameObject({
      name: 'Blorp',

      tags: [Tags.enemy],

      components: [
        new Physical({
          center: {
            x: x,
            y: y
          },
          size: {
            x: 13,
            y: 13,
          },
        }),

        new BlorpController(),

        new PlatformerPhysics(),

        new AnimationManager(this.blorpSheet, 'stand', {
          stand: {
            frames: [0],
            frameLengthMs: null,
          },
          walk: {
            frames: [1, 0],
            frameLengthMs: null,
          }
        }),
      ],
    });

    this.game.entities.add(blorp, null);
  }
}
