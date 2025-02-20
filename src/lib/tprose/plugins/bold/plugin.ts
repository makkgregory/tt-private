import {
  Command,
  Editor,
  InputRule,
  MarkInputRule,
  Plugin,
} from '../../editor';
import { Schema, SchemaSpec } from '../../model';
import { toggleBold } from './commands';

export const starInputRegex =
  /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))$/;
export const starPasteRegex =
  /(?:^|\s)(\*\*(?!\s+\*\*)((?:[^*]+))\*\*(?!\s+\*\*))/g;
export const underscoreInputRegex =
  /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))$/;
export const underscorePasteRegex =
  /(?:^|\s)(__(?!\s+__)((?:[^_]+))__(?!\s+__))/g;

export class BoldPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        bold: {
          parseDOM: [{ tag: 'b' }, { tag: 'strong' }],
          toDOM: () => {
            return document.createElement('b');
          },
        },
      },
    };
  }

  inputRules(schema: Schema): InputRule[] {
    return [
      new MarkInputRule(starInputRegex, schema.markType('bold')),
      new MarkInputRule(underscoreInputRegex, schema.markType('bold')),
    ];
  }

  pasteRules(schema: Schema): InputRule[] {
    return [
      new MarkInputRule(starPasteRegex, schema.markType('bold')),
      new MarkInputRule(underscorePasteRegex, schema.markType('bold')),
    ];
  }

  onInput(_editor: Editor, event: InputEvent): Command | false {
    switch (event.inputType) {
      case 'formatBold':
        return toggleBold();
      default:
        return false;
    }
  }

  keyMap(): Record<string, Command> {
    return {
      'Mod-B': toggleBold(),
    };
  }
}
