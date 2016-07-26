import * as Pearl from 'pearl';

import Component from './Component';
import GameObject from './GameObject';

export default class Game extends Pearl.Game {
  obj: GameObject;
  private rootComponents: Component<any>[]

  constructor(rootComponents: Component<any>[]) {
    super();
    this.rootComponents = rootComponents;
  }

  init() {
    this.obj = new GameObject({
      name: 'Game',
      components: this.rootComponents,
    });

    this.entities.add(this.obj, null);
  }
}
