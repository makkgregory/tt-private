import { createViewRef } from "../../view/create-view-ref";
import { setOrigin } from "../commands/set-origin";
import { setSelection } from "../commands/set-selection";
import { Editor } from "../editor";

export const ORIGIN_SELECTION = "selection";

export class SelectionHandler {
  constructor(private readonly editor: Editor) {}

  handle(): void {
    if (this.editor.dom.ownerDocument.activeElement !== this.editor.dom) {
      return;
    }
    try {
      const viewRef = createViewRef(this.editor.dom);
      const selection = viewRef.selection(this.editor.state.doc);
      this.editor.apply(setSelection(selection), setOrigin(ORIGIN_SELECTION));
      this.editor.pluginHost.onSelection(this.editor);
    } catch {}
  }
}
