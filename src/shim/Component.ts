import GameObject from './GameObject';
import Game from './Game';

abstract class Component {
  gameObject: GameObject;

  init() {
  }

  update(dt: number) {
  }

  collision(other: GameObject) {
  }

  /*
   * Convenience stuff that maps back to gameObject
   */

  get game(): Game {
    return this.gameObject.game;
  }

  getComponent<T extends Component>(componentType: {new(): T}): T {
    return this.gameObject.getComponent(componentType);
  }
}

export default Component;