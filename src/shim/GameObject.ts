import * as Pearl from 'pearl';

import Physical from './Physical';
import Component from './Component';

export type renderFn = (obj: GameObject, ctx: CanvasRenderingContext2D) => void;

export interface CreateOpts {
  components: Component[];
  render: renderFn;
}

export default class GameObject extends Pearl.Entity<null> {
  game: Pearl.Game;

  private components: Component[];
  private renderFn: renderFn;

  constructor(opts: CreateOpts) {
    super();
    this.components = opts.components;
    this.renderFn = opts.render;
  }

  maybeGetComponent<T extends Component>(componentType: {new(): T}): T | null {
    const c = this.components.find((component) => component instanceof componentType);

    if (!c) {
      return null;
    }

    // TODO: TypeScript doesn't know that c here is instanceof componentType, for some reason,
    // so we unfortunately have to hard-cast here
    return c as T;
  }

  getComponent<T extends Component>(componentType: {new(): T}): T {
    const c = this.maybeGetComponent(componentType);

    if (!c) {
      throw new Error(`could not find component of type ${c}`);
    }

    return c;
  }

  /* Pearl.Entity compatibility */

  init() {
    for (let component of this.components) {
      component.init(this);
    }
  }

  update(dt: number) {
    for (let component of this.components) {
      component.update(this, dt);
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
      component.collision(this, other);
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    this.renderFn(this, ctx);
  }
}
