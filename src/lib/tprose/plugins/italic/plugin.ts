import {
  Command,
  Editor,
  InputRule,
  MarkInputRule,
  Plugin,
} from '../../editor';
import { Schema, SchemaSpec } from '../../model';
import { toggleItalic } from './commands';

export const starInputRegex = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))$/;
export const starPasteRegex = /(?:^|\s)(\*(?!\s+\*)((?:[^*]+))\*(?!\s+\*))/g;
export const underscoreInputRegex = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))$/;
export const underscorePasteRegex = /(?:^|\s)(_(?!\s+_)((?:[^_]+))_(?!\s+_))/g;

export class ItalicPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        italic: {
          parseDOM: [{ tag: 'em' }, { tag: 'i' }],
          toDOM: () => {
            return document.createElement('em');
          },
        },
      },
    };
  }

  inputRules(schema: Schema): InputRule[] {
    return [
      new MarkInputRule(starInputRegex, schema.markType('italic')),
      new MarkInputRule(underscoreInputRegex, schema.markType('italic')),
    ];
  }

  pasteRules(schema: Schema): InputRule[] {
    return [
      new MarkInputRule(starPasteRegex, schema.markType('italic')),
      new MarkInputRule(underscorePasteRegex, schema.markType('italic')),
    ];
  }

  onInput(_editor: Editor, event: InputEvent): Command | false {
    switch (event.inputType) {
      case 'formatItalic':
        return toggleItalic();
      default:
        return false;
    }
  }

  keyMap(): Record<string, Command> {
    return {
      'Mod-I': toggleItalic(),
    };
  }
}
