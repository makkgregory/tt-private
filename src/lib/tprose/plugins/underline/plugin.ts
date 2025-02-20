import { Command, Editor, Plugin } from '../../editor';
import { SchemaSpec } from '../../model';
import { toggleUnderline } from './commands';

export class UnderlinePlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        underline: {
          parseDOM: [{ tag: 'u' }],
          toDOM: () => {
            return document.createElement('u');
          },
        },
      },
    };
  }

  onInput(_editor: Editor, event: InputEvent): Command | false {
    switch (event.inputType) {
      case 'formatUnderline':
        return toggleUnderline();
      default:
        return false;
    }
  }

  keyMap(): Record<string, Command> {
    return {
      'Mod-U': toggleUnderline(),
    };
  }
}
