import {
  Command,
  Editor,
  InputRule,
  MarkInputRule,
  Plugin,
} from '../../editor';
import { Schema, SchemaSpec } from '../../model';
import { toggleStrike } from './commands';

export const inputRegex = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))$/;
export const pasteRegex = /(?:^|\s)(~~(?!\s+~~)((?:[^~]+))~~(?!\s+~~))/g;

export class StrikePlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        strike: {
          parseDOM: [{ tag: 'del' }, { tag: 'strike' }, { tag: 's' }],
          toDOM: () => {
            return document.createElement('del');
          },
        },
      },
    };
  }

  inputRules(schema: Schema): InputRule[] {
    return [new MarkInputRule(inputRegex, schema.markType('strike'))];
  }

  pasteRules(schema: Schema): InputRule[] {
    return [new MarkInputRule(pasteRegex, schema.markType('strike'))];
  }

  onInput(_editor: Editor, event: InputEvent): Command | false {
    switch (event.inputType) {
      case 'formatStrikeThrough':
        return toggleStrike();
      default:
        return false;
    }
  }

  keyMap(): Record<string, Command> {
    return {
      'Mod-S': toggleStrike(),
    };
  }
}
