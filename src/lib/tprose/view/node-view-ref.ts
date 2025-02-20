import { DOMNode, NodeType } from '../model';
import { ViewRef } from './view-ref';

export class NodeViewRef extends ViewRef {
  constructor(
    parent: ViewRef | undefined,
    children: readonly ViewRef[],
    dom: DOMNode,
  ) {
    super(parent, children, dom);
  }

  get type(): NodeType {
    if (!(this.dom.tProseType instanceof NodeType)) {
      throw new Error('Missing tProseType on DOMNode');
    }
    return this.dom.tProseType;
  }

  get size(): number {
    const size = this.children.reduce((acc, view) => acc + view.size, 0);
    return this.type.leaf ? 1 : size + 2;
  }

  get border(): number {
    return this.type.leaf ? 0 : 1;
  }
}
