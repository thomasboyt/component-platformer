import * as Pearl from 'pearl';

import {Component, GameObject, Physical} from './shim';

import PlatformerPhysics from './components/PlatformerPhysics';
import PlayerController from './components/PlayerController';

function renderPlayer(obj: GameObject, ctx: CanvasRenderingContext2D) {
}

export default class Game extends Pearl.Game {
  init() {
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
        // add platformer physics to apply gravity and collision with platforms
        new PlatformerPhysics(),
        // add controls to allow player to move left/right and jump
        new PlayerController(),
      ],

      render: renderPlayer,

      // tags could be used in the future to allow lookups of specific instances of things
      // tag: ['player'],

      // might be useful to be able to specify zIndex here, too?
      // zIndex: 0,
    });

    this.entities.add(player, null);
  }
}
