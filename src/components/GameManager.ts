import * as Pearl from 'pearl';

import {
  GameObject,
  Component,
  AssetManager,
  SpriteSheet,
  CanvasRenderer,
} from '../shim';

import WorldManager from './WorldManager';
import TitleScreenController from './TitleScreenController';

function renderTitle(obj: GameObject, ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#CEE682';

  ctx.textAlign = 'center';

  ctx.font = '40px "Press Start 2P"';
  ctx.fillText('BLORP', 210, 150);

  ctx.font = '16px "Press Start 2P"';
  ctx.fillText('a demo game', 210, 180);

  const offset = 250;

  ctx.fillText('arrows move', 200, offset);
  ctx.fillText('space jumps', 200, offset + 20);
  ctx.fillText('shift shoots', 200, offset + 40);
  ctx.fillText("press space to start", 200, offset +  80);
}

export default class GameManager extends Component<{}> {
  // Game settings
  gravityAccel: number = (5 / 10000);

  // Object references
  title: GameObject | null = null;
  world: GameObject | null = null;

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
        new CanvasRenderer({
          renderFn: renderTitle,
        }),
        new TitleScreenController({
          onAdvance: () => this.handleAdvanceTitle(),
        }),
      ],
    });

    this.game.entities.add(this.title, null);
  }

  handleAdvanceTitle() {
    this.game.entities.destroy(this.title!);
    this.title = null;

    this.world = new GameObject({
      name: 'World',

      components: [
        new WorldManager(),
      ],
    });

    this.game.entities.add(this.world, null);
  }
}
