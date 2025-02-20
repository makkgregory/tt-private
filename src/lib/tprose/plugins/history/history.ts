import { ORIGIN_INPUT_RULE } from '../../editor';
import { EditorState } from '../../state';

const COMPRESSION_DELAY = 500;
const MAX_LENGTH = 100;
export const ORIGIN_HISTORY = 'history';

export class History {
  private history: EditorState[] = [];
  private pointer = -1;
  private lastPushTime = 0;

  get current(): EditorState | undefined {
    return this.history[this.pointer];
  }

  undo(): EditorState | undefined {
    this.pointer = Math.max(0, this.pointer - 1);
    return this.history[this.pointer];
  }

  redo(): EditorState | undefined {
    this.pointer = Math.min(this.history.length - 1, this.pointer + 1);
    return this.history[this.pointer];
  }

  push(state: EditorState): void {
    const now = Date.now();
    const compress = this.shouldCompress(state, now);
    if (this.pointer >= 0 && compress) {
      this.history[this.pointer] = state;
    } else {
      this.history = this.history.slice(0, this.pointer + 1);
      this.history.push(state);
      if (this.history.length > MAX_LENGTH) {
        this.history.shift();
        this.pointer -= 1;
      }
      this.pointer += 1;
    }
    this.lastPushTime = now;
  }

  shouldCompress(state: EditorState, now: number): boolean {
    switch (state.origin) {
      case ORIGIN_INPUT_RULE:
        return false;
      default:
        return now - this.lastPushTime <= COMPRESSION_DELAY;
    }
  }
}
