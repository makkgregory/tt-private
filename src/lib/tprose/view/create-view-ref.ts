import { DOMNode, ELEMENT_NODE, MarkType, NodeType, TEXT_NODE } from '../model';
import { MarkViewRef } from './mark-view-ref';
import { NodeViewRef } from './node-view-ref';
import { TextViewRef } from './text-view-ref';
import { TrailingHackViewRef } from './trailing-hack-view-ref';
import { ViewRef } from './view-ref';

export const createViewRef = (dom: DOMNode, parent?: ViewRef): ViewRef => {
  if (dom.nodeType === TEXT_NODE) {
    return new TextViewRef(parent, dom);
  }
  if (dom.tProseType instanceof NodeType) {
    const children: ViewRef[] = [];
    const viewRef = new NodeViewRef(parent, children, dom);
    dom.childNodes.forEach((childDOM) => {
      children.push(createViewRef(childDOM, viewRef));
    });
    return viewRef;
  }
  if (dom.tProseType instanceof MarkType) {
    const children: ViewRef[] = [];
    const markRef = new MarkViewRef(parent, children, dom, dom.tProseType);
    dom.childNodes.forEach((childDOM) => {
      children.push(createViewRef(childDOM, markRef));
    });
    return markRef;
  }
  if (dom.nodeType === ELEMENT_NODE && (dom as Element).tagName === 'BR') {
    return new TrailingHackViewRef(parent, [], dom);
  }
  throw new Error(`Can't create view ref for DOM node, ${dom.nodeName}`);
};
