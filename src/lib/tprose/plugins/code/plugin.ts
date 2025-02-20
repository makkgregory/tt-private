import { Command, InputRule, MarkInputRule, Plugin } from '../../editor';
import { Schema, SchemaSpec } from '../../model';
import { toggleCode } from './commands';

export const inputRegex = /(^|[^`])`([^`]+)`(?!`)/;
export const pasteRegex = /(^|[^`])`([^`]+)`(?!`)/g;

export class CodePlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        code: {
          parseDOM: [{ tag: 'code' }],
          toDOM: () => {
            return document.createElement('code');
          },
        },
      },
    };
  }

  inputRules(schema: Schema): InputRule[] {
    return [new MarkInputRule(inputRegex, schema.markType('code'))];
  }

  pasteRules(schema: Schema): InputRule[] {
    return [new MarkInputRule(pasteRegex, schema.markType('code'))];
  }

  keyMap(): Record<string, Command> {
    return {
      'Mod-M': toggleCode(),
    };
  }
}
