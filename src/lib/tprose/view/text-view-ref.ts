import { DOMNode } from '../model';
import { NodeViewRef } from './node-view-ref';
import { ViewRef } from './view-ref';

export class TextViewRef extends NodeViewRef {
  constructor(parent: ViewRef | undefined, dom: DOMNode) {
    super(parent, [], dom);
  }

  get size(): number {
    return this.text.length;
  }

  get text(): string {
    return this.dom.nodeValue ?? '';
  }

  get isText(): boolean {
    return true;
  }

  get border(): number {
    return 0;
  }

  viewAtDOM(dom: DOMNode): ViewRef | undefined {
    return this.dom === dom ? this : undefined;
  }

  domAtPos(pos: number): { node: DOMNode; offset: number } {
    return { node: this.dom, offset: pos };
  }

  protected posAtOffset(offset: number): number {
    return this.posAtStart + offset;
  }
}
