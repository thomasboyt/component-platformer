import {Component} from '../shim';

export default class GameManager extends Component {
  gravityAccel: number = (5 / 10000);

  // Singleton bullshit follows

  private static instance: GameManager | null = null;

  static getInstance(): GameManager {
    if (!GameManager.instance) {
      throw new Error('No instance created for GameManager()')
    }

    return GameManager.instance;
  }

  constructor() {
    super();

    if (GameManager.instance) {
      throw new Error('Cannot create more than one instance of GameManager()')
    }

    GameManager.instance = this;
  }
}