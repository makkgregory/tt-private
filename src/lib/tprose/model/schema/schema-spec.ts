import { Mark } from '../ast/mark';
import { Node } from '../ast/node';
import { DOMNode } from '../dom/dom-node';

export type Attrs = Record<string, unknown>;

export interface AttrSpec {
  default: unknown;
}

export interface NodeSpec {
  readonly leaf?: boolean;
  readonly text?: boolean;
  readonly block?: boolean;
  readonly inline?: boolean;
  readonly root?: boolean;
  readonly marks?: string[];
  readonly attrs?: Record<string, AttrSpec>;

  parseDOM?: DOMParseSpec[];
  toDOM?(node: Node): DOMNode;
  leafText?(node: Node): string;
}

export interface MarkSpec {
  attrs?: Record<string, AttrSpec>;
  parseDOM: DOMParseSpec[];
  toDOM(mark: Mark): DOMNode;
}

export interface DOMParseSpec {
  readonly tag: string;
}

export interface SchemaSpec {
  readonly nodes?: Record<string, NodeSpec>;
  readonly marks?: Record<string, MarkSpec>;
}

export const defaultAttrs = (spec: Record<string, AttrSpec>): Attrs => {
  return Object.fromEntries(
    Object.entries(spec).map(([name, attr]) => [name, attr.default]),
  );
};
