import { Mark } from '../ast/mark';
import { DOMNode } from '../dom/dom-node';
import {
  Attrs,
  AttrSpec,
  defaultAttrs,
  DOMParseSpec,
  MarkSpec,
} from './schema-spec';

export class MarkType {
  constructor(
    readonly name: string,
    private readonly spec: MarkSpec,
  ) {}

  get attrs(): Record<string, AttrSpec> {
    return this.spec.attrs ?? {};
  }

  get defaultAttrs(): Attrs {
    return defaultAttrs(this.attrs);
  }

  get parseDOM(): DOMParseSpec[] {
    return this.spec.parseDOM;
  }

  create(attrs: Attrs = {}): Mark {
    return new Mark(this, attrs);
  }

  toDOM(mark: Mark): DOMNode {
    return this.spec.toDOM(mark);
  }
}
