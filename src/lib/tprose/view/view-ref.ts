import { DOMNode, Node } from "../model";
import { Selection } from "../state";

export abstract class ViewRef {
  constructor(
    readonly parent: ViewRef | undefined,
    readonly children: readonly ViewRef[],
    readonly dom: DOMNode
  ) {}

  get isText(): boolean {
    return false;
  }

  get isHack(): boolean {
    return false;
  }

  get size(): number {
    return this.children.reduce((acc, view) => acc + view.size, 0);
  }

  get border(): number {
    return 0;
  }

  get posBefore() {
    return this.parent ? this.parent.posBeforeChild(this) : 0;
  }

  get posAtStart() {
    return this.parent ? this.parent.posBeforeChild(this) + this.border : 0;
  }

  get posAfter() {
    return this.posBefore + this.size;
  }

  get posAtEnd() {
    return this.posAtStart + this.size - 2 * this.border;
  }

  get ownerDocument(): Document {
    if (!this.dom.ownerDocument) {
      throw new Error("DOM node is not attached to a document");
    }
    return this.dom.ownerDocument;
  }

  selection(doc: Node): Selection {
    const domSelection = this.ownerDocument.getSelection();
    if (!domSelection?.focusNode || !domSelection?.anchorNode) {
      return Selection.create(doc, 0);
    }
    const head = this.posAtDOM(
      domSelection.focusNode,
      domSelection.focusOffset
    );
    const anchor = this.posAtDOM(
      domSelection.anchorNode,
      domSelection.anchorOffset
    );
    if (anchor < 0 || head < 0) {
      return Selection.create(doc, 0);
    }
    const $head = doc.resolve(head);
    const $anchor = doc.resolve(anchor);
    return Selection.create(doc, $anchor.pos, $head.pos);
  }

  select(selection: Selection): void {
    const domSelection = this.ownerDocument.getSelection();
    domSelection?.removeAllRanges();
    for (const range of selection.ranges) {
      const from = this.domAtPos(range.from);
      const to = this.domAtPos(range.to);
      const domRange = this.ownerDocument.createRange();
      domRange.setStart(from.node, from.offset);
      domRange.setEnd(to.node, to.offset);
      domSelection?.addRange(domRange);
    }
  }

  posBeforeChild(child: ViewRef): number {
    for (let i = 0, pos = this.posAtStart; ; i++) {
      const curr = this.children[i];
      if (curr === child) {
        return pos;
      }
      pos += curr.size;
    }
  }

  viewAtDOM(dom: DOMNode, offset: number): ViewRef | undefined {
    if (this.dom === dom) {
      return this.children[offset];
    }
    for (const child of this.children) {
      const viewRef = child.viewAtDOM(dom, offset);
      if (viewRef) {
        return viewRef;
      }
    }
    return undefined;
  }

  viewAtPos(pos: number): ViewRef | undefined {
    if (pos < this.posAtStart || pos >= this.posAfter) {
      return undefined;
    }
    for (const child of this.children) {
      if (pos < child.posAfter) {
        return child.viewAtPos(pos);
      }
      if (child.isHack) {
        return child;
      }
    }
    return this;
  }

  posAtDOM(dom: DOMNode, offset: number): number {
    const view = this.viewAtDOM(dom, offset);
    if (!view) {
      return -1;
    }
    return view.isText ? view.posAtStart + offset : view.posBefore;
  }

  domAtPos(pos: number): { node: DOMNode; offset: number } {
    const view = this.viewAtPos(pos);
    if (!view) {
      return { node: this.dom, offset: 0 };
    }
    if (view.isText) {
      return { node: view.dom, offset: pos - view.posAtStart };
    }
    return {
      node: view.parent?.dom ?? this.dom,
      offset: view.parent?.children.indexOf(view) ?? 0,
    };
  }
}
