import {Component} from '../shim';
import AssetManager from './AssetManager';

/**
 * Provides a single location for playing audio assets loaded through `AudioManager`.
 *
 * Example usage:
 *   // Will play the asset with the key of `explosion` in your assets configuration.
 *   audioManager.play('explosion');
 */
export default class AudioManager extends Component {
  ctx: AudioContext;
  muted: boolean;
  volumeNode: GainNode;
  defaultGain: number;

  constructor(defaultGain: number) {
    super();

    this.ctx = new AudioContext();

    this.volumeNode = this.ctx.createGain();
    this.volumeNode.connect(this.ctx.destination);

    this.volumeNode.gain.value = defaultGain;

    this.muted = false;
  }

  play(name: string) {
    const audioMap = this.getComponent(AssetManager).assets.audio;
    const sound = audioMap[name];

    const src = this.ctx.createBufferSource();
    src.connect(this.volumeNode);
    src.buffer = sound;
    src.start(0);
  }

  toggleMute() {
    if (this.muted) {
      this.volumeNode.gain.value = this.defaultGain;
    } else {
      this.volumeNode.gain.value = 0;
    }

    this.muted = !this.muted;
  }
}