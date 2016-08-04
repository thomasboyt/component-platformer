import {
  GameObject,
  Component,
  Physical,
  AnimationManager,
  SpriteSheet,
  PolygonCollider,
  PolygonRenderer,
} from 'pearl';

import GameManager from './GameManager';
import PlatformerPhysics from './PlatformerPhysics';
import PlayerController from './PlayerController';
import BlorpController from './BlorpController';
import {randInt} from '../util/math';

import {palette} from '../constants';
import * as Tags from '../Tags';

interface PlatformPosition {
  x: number;
  width: number;
}

export default class WorldManager extends Component<null> {
  // World settings
  width: number = 400;
  height: number = 400;

  // Object references
  player: GameObject | null;

  // Scroll state
  private scrollY: number = 0;
  private lastSpawnY: number = 0;

  private lastPlatformPosition: PlatformPosition;

  init() {
    this.createWorld();
  }

  update(dt: number) {
    const deltaScroll = dt / 100 * 3;

    this.scrollY += deltaScroll;

    for (let obj of this.gameObject.children) {
      this.scrollObj(obj, deltaScroll);
    }

    if (this.scrollY - this.lastSpawnY > 80) {
      this.generateRandomPlatform(-20);
      this.lastSpawnY = this.scrollY;
    }
  }

  restart() {
    for (let child of this.gameObject.children) {
      // blow up the scene, start fresh!
      this.pearl.entities.destroy(child);
    }

    this.createWorld();
  }

  /**
   * Move an object and all children down by deltaScroll pixels.
   */
  private scrollObj(obj: GameObject, deltaScroll: number) {
    if (!obj.hasTag(Tags.staticBlock)) {
      const objPhys = obj.getComponent(Physical);

      if (objPhys) {
        objPhys.center.y += deltaScroll;
      }
    }

    for (let child of obj.children) {
      this.scrollObj(child, deltaScroll);
    }
  }

  private createWorld() {
    // 400 x 400 static walls on the edges that stay in place
    this.createPlatform(-20, 0, 20, 400, true);
    this.createPlatform(400, 0, 20, 400, true);

    // create full-width landing platform
    this.createPlatform(0, 50, 400, 400);

    this.generateRandomPlatform(-30)

    this.player = this.gameObject.addChild(new GameObject({
      // name is used for debug display and maybe lookups in the future?
      name: 'Player',

      components: [
        // add positioning to the world and make collidable
        new Physical({
          center: {
            x: 200,
            y: 35,
          },
        }),
        // add controls to allow player to move left/right and jump
        new PlayerController({
          world: this.gameObject,
        }),

        PolygonCollider.createBox({
          width: 11,
          height: 20,
        }),

        // add platformer physics to apply gravity and collision with platforms
        new PlatformerPhysics({
          world: this.gameObject,
        }),

        new AnimationManager({
          sheet: this.pearl.obj.getComponent(GameManager).playerSheet,

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
    }));

    // this.createBlorp(350, 35, [0, 400]);
  }

  private generateRandomPlatform(y: number) {
    const lastRange = [
      this.lastPlatformPosition.x,
      this.lastPlatformPosition.x + this.lastPlatformPosition.width,
    ];

    // min width = minimum width of generated platform
    // min gap = minimum gap between the edge of the platform below and the edge of this platform
    const minWidth = 100;
    const minGap = 30;

    // Pick a direction to spawn the next platform in
    let platformDirection: 'left' | 'right';

    if (lastRange[0] - minWidth - minGap < 0) {
      platformDirection = 'right';
    } else if (lastRange[1] + minWidth + minGap > this.width) {
      platformDirection = 'left';
    } else {
      platformDirection = randInt(0, 1) ? 'left' : 'right';
    }

    // Pick a random position + length for the platform
    let x: number;
    let width: number;
    let maxWidth: number;

    if (platformDirection === 'left') {
      x = randInt(0, lastRange[1] - minGap - minWidth);
      maxWidth = lastRange[1] - x - minGap;
      width = randInt(minWidth, maxWidth);

    } else {
      x = randInt(lastRange[0] + minGap, this.width - minWidth);
      maxWidth = this.width - x;
      width = randInt(minWidth, maxWidth);
    }

    this.createPlatform(x, y, width, 20);

    // if (randInt(1, 3) === 1) {
    // const blorpX = randInt(x + 7, x + width - 7);
    // this.createBlorp(blorpX, y - 7, [x, x + width]);
    // }
  }

  private createPlatform(x: number, y: number, width: number, height: number, isStatic?: boolean) {
    const cx = x + width / 2;
    const cy = y + height / 2;

    const tags = [Tags.block];
    if (isStatic) {
      tags.push(Tags.staticBlock);
    }

    this.gameObject.addChild(new GameObject({
      name: 'Platform',

      tags,

      components: [
        new Physical({
          center: {
            x: cx,
            y: cy,
          },
        }),

        PolygonCollider.createBox({
          width,
          height,
        }),

        new PolygonRenderer({
          fillStyle: palette.lighter,
        }),
      ],
    }));

    this.lastPlatformPosition = {x, width};
  }

  private createBlorp(x: number, y: number, patrolBounds: [number, number]) {
    this.gameObject.addChild(new GameObject({
      name: 'Blorp',

      tags: [Tags.enemy],

      components: [
        new Physical({
          center: {
            x: x,
            y: y
          },
        }),

        new BlorpController({
          world: this.gameObject,
          patrolBounds,
        }),

        PolygonCollider.createBox({
          width: 13,
          height: 13,
        }),

        new PlatformerPhysics({
          world: this.gameObject,
        }),

        new AnimationManager({
          sheet: this.pearl.obj.getComponent(GameManager).blorpSheet,
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
    }));
  }
}