import { MarkType } from '../schema/mark-type';
import { NodeType } from '../schema/node-type';

export interface DOMNode extends globalThis.Node {
  tProseType?: NodeType | MarkType;
}

export const TEXT_NODE = 3;
export const ELEMENT_NODE = 1;
