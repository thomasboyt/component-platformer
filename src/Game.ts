import * as Pearl from 'pearl';

import {Component, GameObject, Physical} from './shim';

import PlatformerPhysics, {BLOCK_TAG} from './components/PlatformerPhysics';
import PlayerController from './components/PlayerController';
import GameManager from './components/GameManager';

function renderPlayer(obj: GameObject, ctx: CanvasRenderingContext2D) {
  const phys = obj.getComponent(Physical);

  ctx.fillStyle = 'blue';
  ctx.fillRect(phys.center.x - phys.size.x / 2,
               phys.center.y - phys.size.y / 2,
               phys.size.x,
               phys.size.y);
}

function renderPlatform(obj: GameObject, ctx: CanvasRenderingContext2D) {
  const phys = obj.getComponent(Physical);

  ctx.fillStyle = 'white';
  ctx.fillRect(phys.center.x - phys.size.x / 2,
               phys.center.y - phys.size.y / 2,
               phys.size.x,
               phys.size.y);
}

export default class Game extends Pearl.Game {
  init() {

    // create singleton GameManager object
    // components can access this thru GameManager.getInstance() but I'm not sold on this yet
    const manager = new GameObject({
      name: 'GameManager',

      components: [
        new GameManager(),
      ],
    });

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

    this.entities.add(player, null);

    this.entities.add(platform, null);
  }
}
