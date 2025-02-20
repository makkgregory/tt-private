import { Editor } from '../editor';

export class KeyboardHandler {
  constructor(private readonly editor: Editor) {}

  handle(event: KeyboardEvent): void {
    const command = this.editor.pluginHost.onKeyboard(this.editor, event);
    if (command) {
      event.preventDefault();
      this.editor.apply(command);
    }
  }
}
