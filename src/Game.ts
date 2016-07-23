import * as Pearl from 'pearl';

import {Component, GameObject, createGameObject} from './GameObject';

import Physical from './components/Physical';
import PlatformerPhysics from './components/PlatformerPhysics';
import PlayerController from './components/PlayerController';

function renderPlayer(obj: GameObject, ctx: CanvasRenderingContext2D) {
}

export default class Game extends Pearl.Game {
  init() {
    const player = createGameObject({
      components: [
        new Physical(),
        new PlatformerPhysics(),
        new PlayerController(),
      ],

      render: renderPlayer,

      // tags could be used in the future to allow lookups of specific instances of things
      // tag: ['player'],

      // so could names, plus names can be used to label game objects in dev tooling
      // name: 'player',
    });

    this.entities.add(player, null);
  }
}
