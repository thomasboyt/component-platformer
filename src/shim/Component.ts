import GameObject from './GameObject';

abstract class Component {
  init(self: GameObject) {
  }

  update(self: GameObject, dt: number) {
  }

  collision(self: GameObject, other: GameObject) {
  }
}

export default Component;