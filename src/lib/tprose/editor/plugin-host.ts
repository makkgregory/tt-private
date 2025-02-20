import { Schema, SchemaSpec } from '../model';
import { Command } from './commands/command';
import { Editor } from './editor';
import { InputRule } from './input-rules/input-rule';
import { Plugin } from './plugin';
import { normalizeKeyName, resolveKeyName } from './utils/key-name';

export class PluginHost implements Plugin {
  private readonly _plugins: readonly Plugin[];

  constructor(plugins: readonly Plugin[]) {
    this._plugins = PluginHost.expand(plugins);
  }

  private static expand(plugins: readonly Plugin[]): Plugin[] {
    return plugins.flatMap((plugin) => {
      const nested = PluginHost.expand([...(plugin.plugins?.() ?? [])]);
      return [plugin, ...nested];
    });
  }

  onInit(editor: Editor): void {
    this.plugins().forEach((plugin) => plugin.onInit?.(editor));
  }

  onUpdate(editor: Editor): void {
    this.plugins().forEach((plugin) => plugin.onUpdate?.(editor));
  }

  onSelection(editor: Editor): void {
    this.plugins().forEach((plugin) => plugin.onSelection?.(editor));
  }

  onInput(editor: Editor, event: InputEvent): Command | false {
    for (const plugin of this.plugins()) {
      const command = plugin.onInput?.(editor, event);
      if (command) {
        return command;
      }
    }
    return false;
  }

  onKeyboard(editor: Editor, event: KeyboardEvent): Command | false {
    const keyName = resolveKeyName(event);
    const keyMapCommand = this.keyMap()[keyName];
    if (keyMapCommand) {
      return keyMapCommand;
    }
    for (const plugin of this.plugins()) {
      const command = plugin.onKeyboard?.(editor, event);
      if (command) {
        return command;
      }
    }
    return false;
  }

  onDestroy(): void {
    this.plugins().forEach((plugin) => plugin.onDestroy?.());
  }

  schema(): SchemaSpec {
    return this.plugins().reduce((acc, plugin) => {
      const schema = plugin.schema?.() ?? {};
      Object.keys(schema.nodes ?? {}).forEach((name) => {
        if (acc.nodes?.[name]) {
          throw new Error(`Duplicate node type: ${name}`);
        }
      });
      Object.keys(schema.marks ?? {}).forEach((name) => {
        if (acc.marks?.[name]) {
          throw new Error(`Duplicate mark type: ${name}`);
        }
      });
      return {
        nodes: { ...acc.nodes, ...schema.nodes },
        marks: { ...acc.marks, ...schema.marks },
      };
    }, {} as SchemaSpec);
  }

  keyMap(): Record<string, Command> {
    return this.plugins()
      .map((plugin) => plugin.keyMap?.() ?? {})
      .reduce(
        (acc, keyMap) => {
          Object.entries(keyMap).forEach(([keyName, command]) => {
            acc[normalizeKeyName(keyName)] = command;
          });
          return acc;
        },
        {} as Record<string, Command>,
      );
  }

  inputRules(schema: Schema): InputRule[] {
    return this.plugins().flatMap((plugin) => [
      ...(plugin.inputRules?.(schema) ?? []),
    ]);
  }

  pasteRules(schema: Schema): InputRule[] {
    return this.plugins().flatMap((plugin) => [
      ...(plugin.pasteRules?.(schema) ?? []),
    ]);
  }

  plugins(): readonly Plugin[] {
    return this._plugins;
  }
}
