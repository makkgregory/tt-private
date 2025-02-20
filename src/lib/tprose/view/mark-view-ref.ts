import { DOMNode, MarkType } from '../model';
import { ViewRef } from './view-ref';

export class MarkViewRef extends ViewRef {
  constructor(
    parent: ViewRef | undefined,
    children: readonly ViewRef[],
    dom: DOMNode,
    readonly type: MarkType,
  ) {
    super(parent, children, dom);
  }
}
