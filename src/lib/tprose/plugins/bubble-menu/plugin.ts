import { requestMutation } from "../../../fasterdom/fasterdom";
import React from "../../../teact/teact";
import ReactDOM from "../../../teact/teact-dom";
import { Command, Editor, Plugin } from "../../editor";
import BubbleMenu from "./BubbleMenu";

export class BubbleMenuPlugin implements Plugin {
  private menuDOM!: HTMLElement;
  private editor!: Editor;
  private frameId = 0;

  onInit(editor: Editor): void {
    this.menuDOM = editor.dom.ownerDocument.createElement("div");
    this.menuDOM.style.position = "fixed";
    this.menuDOM.style.top = "0";
    this.menuDOM.style.left = "0";
    this.menuDOM.style.zIndex = "50";
    this.menuDOM.style.display = "none";
    this.editor = editor;
    editor.dom.ownerDocument.body.appendChild(this.menuDOM);
    this.render();
    this.watchMenu();
  }

  onUpdate(): void {
    this.render();
  }

  onDestroy(): void {
    this.menuDOM.remove();
    cancelAnimationFrame(this.frameId);
  }

  keyMap(): Record<string, Command> {
    return {
      "Mod-K": ({ state }) => {
        return state;
      },
    };
  }

  private render(): void {
    requestMutation(() => {
      ReactDOM.render(
        React.createElement(BubbleMenu, {
          editor: this.editor,
          state: this.editor.state,
        }) as any,
        this.menuDOM
      );
    });
  }

  private watchMenu(): void {
    this.updateMenu();
    this.frameId = requestAnimationFrame(() => this.watchMenu());
  }

  private updateMenu(): void {
    const selection = this.editor.dom.ownerDocument.getSelection();
    if (this.editor.dom.ownerDocument.activeElement !== this.editor.dom) {
      return;
    }
    if (!selection || !selection.rangeCount || selection.isCollapsed) {
      this.menuDOM.style.display = "none";
      return;
    }
    this.menuDOM.style.display = "block";
    const range = selection.getRangeAt(0);
    const bounds = range.getBoundingClientRect();
    const top = Math.max(bounds.top - this.menuDOM.offsetHeight, 0);
    const center = Math.max(bounds.left + bounds.width / 2, 0);
    this.menuDOM.style.translate = `${center}px ${top}px`;
  }
}
