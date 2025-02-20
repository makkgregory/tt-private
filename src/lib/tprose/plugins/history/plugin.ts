import { Command, Editor, Plugin } from '../../editor';
import { historyRedo, historyUndo } from './commands';
import { History, ORIGIN_HISTORY } from './history';

export class HistoryPlugin implements Plugin {
  readonly history = new History();

  onUpdate({ state }: Editor): void {
    if (state.origin == ORIGIN_HISTORY) {
      return;
    }
    if (this.history.current?.doc.equals(state.doc)) {
      return;
    }
    this.history.push(state);
  }

  onInput(_editor: Editor, event: InputEvent): Command | false {
    switch (event.inputType) {
      case 'historyUndo':
        return historyUndo(this.history);
      case 'historyRedo':
        return historyRedo(this.history);
      default:
        return false;
    }
  }

  keyMap(): Record<string, Command> {
    return {
      'Mod-z': historyUndo(this.history),
      'Mod-Shift-z': historyRedo(this.history),
    };
  }
}
