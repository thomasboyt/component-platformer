import Component from '../Component';

import Sprite from '../util/Sprite';
import SpriteSheet from '../util/SpriteSheet';

const blankSprite = new Sprite(new Image(), 0, 0, 0, 0);

interface AnimationConfig {
  frames: number[];
  frameLengthMs: number | null;
}

class Animation {
  private _sheet: SpriteSheet;
  private _frameLengthMs: number | null;

  private _frames: number[];
  private _currentFrameIdx: number;

  private _elapsed: number;

  constructor(sheet: SpriteSheet, cfg: AnimationConfig) {
    this._sheet = sheet;

    this._frames = cfg.frames;
    this._frameLengthMs = cfg.frameLengthMs;

    this._currentFrameIdx = 0;
    this._elapsed = 0;
  }

  update(dt: number) {
    this._elapsed += dt;

    if (this._frameLengthMs === null) {
      return;
    }

    if (this._elapsed > this._frameLengthMs) {
      this._currentFrameIdx += 1;

      if (this._currentFrameIdx >= this._frames.length) {
        this._currentFrameIdx = 0;
      }

      this._elapsed = 0;
    }
  }

  getSprite() {
    const frame = this._frames[this._currentFrameIdx];

    if (frame === null) {
      return blankSprite;
    } else {
      return this._sheet.get(frame);
    }
  }

}

interface AnimationConfigMap {
  [key: string]: AnimationConfig;
}

export default class AnimationManager extends Component {
  private _sheet: SpriteSheet;
  private _animationConfig: AnimationConfigMap;
  private _currentState: string;
  private _current: Animation;

  constructor(sheet: SpriteSheet, initialState: string, animations: AnimationConfigMap) {
    super();
    this._sheet = sheet;
    this._animationConfig = animations;
    this.set(initialState);
  }

  set(state: string) {
    if (state === this._currentState) {
      return;
    }

    this._currentState = state;
    const cfg = this._animationConfig[state];
    this._current = new Animation(this._sheet, cfg);
  }

  getSprite(): Sprite {
    return this._current.getSprite();
  }

  update(dt: number) {
    this._current.update(dt);
  }
}
