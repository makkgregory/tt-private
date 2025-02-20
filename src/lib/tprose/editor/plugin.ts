import { Schema, SchemaSpec } from '../model';
import { Command } from './commands/command';
import { Editor } from './editor';
import { InputRule } from './input-rules/input-rule';

export interface Plugin {
  schema?(): SchemaSpec;
  keyMap?(): Record<string, Command>;
  inputRules?(schema: Schema): Iterable<InputRule>;
  pasteRules?(schema: Schema): Iterable<InputRule>;
  plugins?(): Iterable<Plugin>;

  onInit?(editor: Editor): void;
  onUpdate?(editor: Editor): void;
  onSelection?(editor: Editor): void;
  onInput?(editor: Editor, event: InputEvent): Command | false;
  onKeyboard?(editor: Editor, event: KeyboardEvent): Command | false;
  onDestroy?(): void;
}
