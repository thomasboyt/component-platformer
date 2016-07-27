import * as Pearl from 'pearl';

import Physical from './components/Physical';
import Component from './Component';
import Game from './Game';

export interface CreateOpts {
  name: string;
  components: Component<any>[];
  zIndex?: number;
  tags?: string[];
}

export default class GameObject extends Pearl.Entity<null> {
  game: Game;

  private name: string;
  private components: Component<any>[] = [];
  private tags: string[] = [];

  constructor(opts: CreateOpts) {
    super();

    this.name = opts.name;

    for (let component of opts.components) {
      this.addComponent(component);
    }

    if (opts.zIndex !== undefined) {
      this.zIndex = opts.zIndex;
    }

    if (opts.tags !== undefined) {
      this.tags = opts.tags;
    }
  }

  private addComponent(component: Component<any>) {
    component.gameObject = this;
    this.components.push(component);
  }

  // TODO: probably use a Set or Map for this
  hasTag(tag: string): boolean {
    return !!this.tags.find((val) => val === tag);
  }

  maybeGetComponent<T extends Component<any>>(componentType: {new(...args: any[]): T}): T | null {
    const c = this.components.find((component) => component instanceof componentType);

    if (!c) {
      return null;
    }

    // TODO: TypeScript doesn't know that c here is instanceof componentType, for some reason,
    // so we unfortunately have to hard-cast here
    return c as T;
  }

  getComponent<T extends Component<any>>(componentType: {new(...args: any[]): T}): T {
    const c = this.maybeGetComponent(componentType);

    if (!c) {
      throw new Error(`could not find component of type ${componentType.name}`);
    }

    return c;
  }

  sendMessage(name: string, ...args: any[]) {
    for (let component of this.components) {
      if (typeof component[name] === 'function') {
        component[name](...args);
      }
    }
  }

  /* Pearl.Entity compatibility */

  init() {
    // game is set at this point
    for (let component of this.components) {
      component.init(component.initialSettings);
    }
  }

  update(dt: number) {
    for (let component of this.components) {
      component.update(dt);
    }

    const phys = this.maybeGetComponent(Physical);

    if (phys) {
      this.center = phys.center;
      this.size = phys.size;
      this.boundingBox = phys.boundingBox;
      this.angle = phys.angle;
    }
  }

  collision(other: GameObject) {
    for (let component of this.components) {
      component.collision(other);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    for (let component of this.components) {
      component.render(ctx);
    }
  }

  onDestroy() {
    for (let component of this.components) {
      component.onDestroy();
    }
  }
}
