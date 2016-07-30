import * as Pearl from 'pearl';

import {
  GameObject,
  Component,
  AssetManager,
  SpriteSheet,
} from 'pearl-component-shim';

import WorldManager from './WorldManager';
import TitleScreenController from './TitleScreenController';
import GameOverController from './GameOverController';
import StarfieldRenderer from './render/StarfieldRenderer';

export default class GameManager extends Component<{}> {
  // Game settings
  gravityAccel: number = (5 / 10000);

  // Object references
  title: GameObject | null = null;
  world: GameObject | null = null;
  gameOverScreen: GameObject | null = null;

  blorpSheet: SpriteSheet;
  playerSheet: SpriteSheet;

  init() {
    const assetManager = this.getComponent(AssetManager);

    assetManager.load().then(() => {
      const blorpSheetImg = this.getComponent(AssetManager).getImage('blorpSheet');
      this.blorpSheet = new SpriteSheet(blorpSheetImg, 13, 13);

      const playerSheetImg = this.getComponent(AssetManager).getImage('playerSheet');
      this.playerSheet = new SpriteSheet(playerSheetImg, 20, 20);

      this.showTitle();
    });
  }

  showTitle() {
    this.title = new GameObject({
      name: 'TitleScreen',

      components: [
        new StarfieldRenderer(),

        new TitleScreenController({
          onAdvance: () => this.handleAdvanceTitle(),
        }),
      ],
    });

    this.pearl.entities.add(this.title, null);
  }

  startGame() {
    this.world = new GameObject({
      name: 'World',

      components: [
        new WorldManager(),
      ],
    });

    this.pearl.entities.add(this.world, null);
  }

  handleAdvanceTitle() {
    this.pearl.entities.destroy(this.title!);
    this.title = null;
    this.startGame();
  }

  enterGameOver() {
    this.pearl.entities.destroy(this.world!);
    this.world = null;

    this.gameOverScreen = new GameObject({
      name: 'GameOverScreen',

      components: [
        new StarfieldRenderer(),

        new GameOverController({
          onRestart: () => this.handleRestartGame(),
        }),
      ],
    });

    this.pearl.entities.add(this.gameOverScreen, null);
  }

  handleRestartGame() {
    this.pearl.entities.destroy(this.gameOverScreen!);
    this.gameOverScreen = null;

    this.startGame();
  }

  playerDied() {
    this.enterGameOver();
  }
}
