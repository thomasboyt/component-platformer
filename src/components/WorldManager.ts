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

interface LastPlatform {
  width: number;
  height: number;
  x: number;
  y: number;
}

export default class WorldManager extends Component<null> {
  // World settings
  width: number = 400;
  height: number = 400;

  // Object references
  player?: GameObject;

  // Scroll state
  private scrollX!: number;
  private lastPlatform!: LastPlatform;

  init() {
    this.createWorld();
  }

  update(dt: number) {
    const deltaScroll = dt / 100 * 3;

    this.scrollX += deltaScroll;

    for (let obj of this.gameObject.children) {
      this.scrollObj(obj, deltaScroll);
    }

    this.lastPlatform.x -= deltaScroll;

    if (this.width - (this.lastPlatform.x + this.lastPlatform.width) > 80) {
      this.generateNextPlatform();
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
        objPhys.translate({
          x: -deltaScroll,
          y: 0,
        });
      }

      if (obj.maybeGetComponent(PolygonCollider) && this.isOffscreen(obj)) {
        if (obj.hasTag(Tags.player)) {
          obj.getComponent(PlayerController).died();
          this.pearl.obj.getComponent(GameManager).playerDied();
        }

        this.pearl.entities.destroy(obj);
      }
    }

    for (let child of obj.children) {
      this.scrollObj(child, deltaScroll);
    }
  }

  /**
   * Returns true if the object has been scrolled past or if the object has fallen off the world
   */
  private isOffscreen(obj: GameObject): boolean {
    const poly = obj.getComponent(PolygonCollider);
    const {xMax, yMin} = poly.getBounds();

    return (xMax < 0 || yMin > this.height);
  }

  private createWorld() {
    this.scrollX = 0;

    // create full-width starting platform
    this.createPlatform(0, 350, 400, 50);

    this.player = this.gameObject.addChild(new GameObject({
      // name is used for debug display and maybe lookups in the future?
      name: 'Player',

      components: [
        // add positioning to the world and make collidable
        new Physical({
          center: {
            x: 200,
            y: 340,
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

      tags: [Tags.player],
    }));
  }

  private generateNextPlatform() {
    const x = this.width + 50;  // TODO: obviously randomize dis
    const prevY = this.lastPlatform.y;

    const padding = 25;
    const lowerY = prevY - 100 < padding ? padding : prevY - 100;
    const upperY = prevY + 100 > this.height - padding ? this.height - padding : prevY + 100;
    const y = randInt(lowerY, upperY);

    const width = randInt(50, 200);

    const platform = this.createPlatform(x, y, width, 20);

    // if (randInt(1, 3) === 1) {
      const blorpX = randInt(x + 7, x + width - 7);
      this.createBlorp(blorpX, y - 7, platform);
    // }
  }

  private createPlatform(x: number, y: number, width: number, height: number, isStatic?: boolean): GameObject {
    const cx = x + width / 2;
    const cy = y + height / 2;

    const tags = [Tags.block];
    if (isStatic) {
      tags.push(Tags.staticBlock);
    }

    const platform = this.gameObject.addChild(new GameObject({
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

    this.lastPlatform = {x, y, width, height};

    return platform;
  }

  private createBlorp(x: number, y: number, platform: GameObject) {
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
          platform,
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