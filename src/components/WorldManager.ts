import * as Pearl from 'pearl';

import {
  GameObject,
  Component,
  Physical,
  AnimationManager,
  SpriteSheet,
} from '../shim';

import GameManager from './GameManager';
import PlatformerPhysics from './PlatformerPhysics';
import PlayerController from './PlayerController';
import BlorpController from './BlorpController';
import PlatformRenderer from './render/PlatformRenderer';

import * as Tags from '../Tags';

export default class WorldManager extends Component<{}> {
  // World settings
  width: number = 400;
  height: number = 400;

  // Object references
  player: GameObject | null;

  // TODO: maybe... don't... manually manage this...
  enemies: GameObject[] = [];
  platforms: GameObject[] = [];

  init() {
    this.createWorld();
  }

  createWorld() {
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

        new AnimationManager({
          sheet: this.game.obj.getComponent(GameManager).playerSheet,

          initialState: 'stand',

          animations: {
            stand: {
              frames: [0],
              frameLengthMs: null,
            },
            walk: {
              frames: [1, 0],
              frameLengthMs: 200,
            },
            dead: {
              frames: [2],
              frameLengthMs: null,
            }
          },
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

        new PlatformRenderer(),
      ],
    });

    this.platforms.push(platform);
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

        new BlorpController({
          world: this.gameObject,
        }),

        new PlatformerPhysics(),

        new AnimationManager({
          sheet: this.game.obj.getComponent(GameManager).blorpSheet,
          initialState: 'stand',
          animations: {
            stand: {
              frames: [0],
              frameLengthMs: null,
            },
            walk: {
              frames: [1, 0],
              frameLengthMs: null,
            }
          },
        }),
      ],
    });

    this.enemies.push(blorp);
    this.game.entities.add(blorp, null);
  }

  destroyWorld() {
    const entities = [
      ...this.enemies,
      ...this.platforms,
      this.player!
    ];

    for (let entity of entities) {
      this.game.entities.destroy(entity);
      this.player = null;
    }
  }

  restart() {
    this.destroyWorld();
    this.createWorld();
  }
}