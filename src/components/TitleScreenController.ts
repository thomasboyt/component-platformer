import * as Pearl from 'pearl';
import {Component} from '../shim';

interface Options {
  onAdvance: () => void;
}

export default class TitleScreenController extends Component<Options> {
  private handleAdvanceTitle: () => void;

  init(opts: Options) {
    this.handleAdvanceTitle = opts.onAdvance;
  }

  update(dt: number) {
    if (this.game.inputter.isKeyPressed(Pearl.Keys.space)) {
      this.handleAdvanceTitle();
    }
  }
}