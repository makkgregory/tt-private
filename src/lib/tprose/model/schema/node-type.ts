import { Fragment } from "../ast/fragment";
import { MarkSet } from "../ast/mark-set";
import { Node } from "../ast/node";
import { DOMNode } from "../dom/dom-node";
import { MarkType } from "./mark-type";
import {
  Attrs,
  AttrSpec,
  defaultAttrs,
  DOMParseSpec,
  NodeSpec,
} from "./schema-spec";

export class NodeType {
  constructor(readonly name: string, private readonly spec: NodeSpec) {}

  get leaf(): boolean {
    if (this.text) {
      return true;
    }
    return this.spec.leaf ?? false;
  }

  get block(): boolean {
    return this.spec.root ? true : this.spec.block ?? false;
  }

  get inline(): boolean {
    if (this.text) {
      return true;
    }
    return this.spec.inline ?? false;
  }

  get text(): boolean {
    return this.spec.text ?? false;
  }

  get root(): boolean {
    return this.spec.root ?? false;
  }

  get parseDOM(): DOMParseSpec[] {
    return this.spec.parseDOM ?? [];
  }

  get attrs(): Record<string, AttrSpec> {
    return this.spec.attrs ?? {};
  }

  get defaultAttrs(): Attrs {
    return defaultAttrs(this.attrs);
  }

  create(
    content = Fragment.EMPTY,
    marks = MarkSet.EMPTY,
    attrs: Attrs = {}
  ): Node {
    if (this.text) {
      throw new Error("Cannot create a node from a text type");
    }
    return new Node(this, content, marks, attrs);
  }

  supportsMark(type: MarkType): boolean {
    if (!this.inline) {
      return false;
    }
    return this.spec.marks?.includes(type.name) ?? true;
  }

  toDOM(node: Node): DOMNode {
    if (!this.spec.toDOM) {
      return document.createDocumentFragment();
    }
    return this.spec.toDOM(node);
  }

  leafText(node: Node): string {
    return this.spec.leafText?.(node) ?? "";
  }
}
