import { Fragment, TextNode } from "../../model";
import { EditorState, Selection } from "../../state";
import { createViewRef } from "../../view/create-view-ref";
import { setState } from "../commands/set-state";
import { Editor } from "../editor";

export const ORIGIN_INPUT = "input";

export class InputHandler {
  constructor(private readonly editor: Editor) {}

  handleBeforeInput(event: InputEvent): void {
    const command = this.editor.pluginHost.onInput(this.editor, event);
    if (command) {
      event.preventDefault();
      this.editor.apply(command);
      return;
    }

    switch (event.inputType) {
      case "insertFromPaste":
        event.preventDefault();
        this.handlePaste(event);
        break;
      case "insertText":
      case "insertReplacementText":
      case "insertTranspose":
      case "insertCompositionText":
      case "deleteWordBackward":
      case "deleteWordForward":
      case "deleteSoftLineBackward":
      case "deleteSoftLineForward":
      case "deleteEntireSoftLine":
      case "deleteHardLineBackward":
      case "deleteHardLineForward":
      case "deleteByDrag":
      case "deleteByCut":
      case "deleteContent":
      case "deleteContentBackward":
      case "deleteContentForward":
        break;
      default:
        event.preventDefault();
    }
  }

  handleInput(event: InputEvent): void {
    const doc = this.editor.parser.parseDoc(this.editor.dom);
    try {
      const viewRef = createViewRef(this.editor.dom);
      const selection = viewRef.selection(doc);
      const state = new EditorState(doc, selection, ORIGIN_INPUT);
      this.editor.apply(setState(state));
    } catch {
      const state = new EditorState(
        doc,
        Selection.create(doc, 0),
        ORIGIN_INPUT
      );
      this.editor.apply(setState(state));
      this.editor.renderer.render(doc);
    }
    this.handleInputRules(event);
  }

  private handlePaste(event: InputEvent): void {
    const content = this.getTransferContent(event);
    const { from, to } = this.editor.state.selection;
    const { state } = this.editor.state
      .tx()
      .delete(from, to)
      .replace(from, from, content);
    const resultState = this.handlePasteRule(state, from, from + content.size);
    this.editor.apply(setState(resultState));
  }

  private handlePasteRule(
    state: EditorState,
    from: number,
    to: number
  ): EditorState {
    const pasteRules = this.editor.pluginHost.pasteRules(this.editor.schema);
    let resultState = state;
    state.doc.nodesBetween(from, to, (node, pos) => {
      if (!(node instanceof TextNode)) {
        return;
      }
      const start = Math.max(from, pos);
      const end = Math.min(to, pos + node.size);
      const text = node.textBetween(start - pos, end - pos);
      for (const rule of pasteRules) {
        const match = new RegExp(rule.regex).exec(text);
        if (!match) {
          continue;
        }
        const matchStart = start + match.index;
        const matchEnd = matchStart + match[0].length;
        resultState = rule.apply(state, matchStart, matchEnd, match);
      }
    });
    return resultState;
  }

  private handleInputRules(event: InputEvent): void {
    if (event.isComposing) {
      return;
    }
    const { $from } = this.editor.state.selection;
    const node = $from.nodeBefore;
    const textContent = node?.textContent ?? "";
    const inputRules = this.editor.pluginHost.inputRules(this.editor.schema);
    for (const rule of inputRules) {
      const match = new RegExp(rule.regex).exec(textContent);
      if (!match) {
        continue;
      }
      const from = $from.pos - match[0].length;
      const to = $from.pos;
      const state = rule.apply(this.editor.state, from, to, match);
      this.editor.apply(setState(state));
      event.preventDefault();
      return;
    }
  }

  private getTransferContent(event: InputEvent): Fragment {
    const html = event.dataTransfer?.getData("text/html");
    if (html) {
      const doc = new DOMParser().parseFromString(html, "text/html");
      return this.editor.parser.parseFragment(doc.body).normalize();
    }
    const text = event.dataTransfer?.getData("text/plain") ?? "";
    if (!text) {
      return Fragment.EMPTY;
    }
    return new Fragment([this.editor.schema.text(text)]);
  }
}
