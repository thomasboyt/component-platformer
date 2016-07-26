import GameObject from './GameObject';
import Game from './Game';

abstract class Component<Settings> {
  gameObject: GameObject;

  initialSettings?: Settings;

  constructor(settings?: Settings) {
    this.initialSettings = settings;
  }

  init(settings: Settings) {
  }

  update(dt: number) {
  }

  collision(other: GameObject) {
  }

  render(ctx: CanvasRenderingContext2D) {
  }

  /*
   * Convenience stuff that maps back to gameObject
   */

  get game(): Game {
    return this.gameObject.game;
  }

  getComponent<T extends Component<any>>(componentType: {new(...args: any[]): T}): T {
    return this.gameObject.getComponent(componentType);
  }

  sendMessage(name: string, ...args: any[]) {
    this.gameObject.sendMessage(name, ...args);
  }
}

export default Component;
