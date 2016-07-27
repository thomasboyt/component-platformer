import GameObject from './GameObject';
import Game from './Game';

abstract class Component<Settings> {
  gameObject: GameObject;

  initialSettings?: Settings;

  constructor(settings?: Settings) {
    this.initialSettings = settings;
  }

  // public hooks

  init(settings: Settings) {
  }

  update(dt: number) {
  }

  collision(other: GameObject) {
  }

  render(ctx: CanvasRenderingContext2D) {
  }

  onDestroy() {
  }

  /*
   * Convenience stuff that maps back to gameObject
   */

  get pearl(): Game {
    return this.gameObject.game;
  }

  getComponent<T extends Component<any>>(componentType: {new(...args: any[]): T}): T {
    return this.gameObject.getComponent(componentType);
  }
}

export default Component;
