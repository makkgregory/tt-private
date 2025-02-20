import { Fragment } from "../ast/fragment";
import { MarkSet } from "../ast/mark-set";
import { Node } from "../ast/node";
import { MarkType } from "../schema/mark-type";
import { NodeType } from "../schema/node-type";
import type { Schema } from "../schema/schema";
import { Attrs, AttrSpec } from "../schema/schema-spec";
import { DOMNode, ELEMENT_NODE, TEXT_NODE } from "./dom-node";

export class DOMParser {
  constructor(private readonly schema: Schema) {}

  parseDoc(root: DOMNode): Node {
    const content = this.parseFragment(root);
    return this.schema.doc(content);
  }

  parseFragment(root: DOMNode): Fragment {
    const result = this.parseChildren(root, MarkSet.EMPTY);
    return new Fragment(result).normalize();
  }

  private parseChildren(parent: DOMNode, marks: MarkSet): Node[] {
    return Array.from(parent.childNodes).reduce((acc, curr) => {
      const result = this.parseNode(curr, marks);
      acc.push(...result);
      return acc;
    }, [] as Node[]);
  }

  private parseNode(node: DOMNode, marks: MarkSet): Node[] {
    const markType = this.matchMark(node);
    if (markType) {
      const attrs = this.parseAttrs(node, markType.attrs);
      const mark = this.schema.mark(markType.name, attrs);
      return this.parseChildren(node, marks.add(mark));
    }
    const nodeType = this.matchNode(node);
    if (nodeType?.text) {
      const text = node.nodeValue ?? "";
      if (!text) {
        return [];
      }
      const result = this.schema.text(text, marks);
      return [result];
    }
    const children = this.parseChildren(node, marks);
    const content = this.schema.fragment(children);
    if (!nodeType) {
      return children;
    }
    const attrs = this.parseAttrs(node, nodeType.attrs);
    const result = this.schema.node(nodeType.name, content, marks, attrs);
    return [result];
  }

  private parseAttrs(node: DOMNode, spec: Record<string, AttrSpec>): Attrs {
    if (node.nodeType !== ELEMENT_NODE) {
      return {};
    }
    const element = node as Element;
    return Object.entries(spec).reduce((acc, [key, value]) => {
      const attr = element.getAttribute(key);
      if (typeof attr !== "string") {
        return { ...acc, [key]: value.default };
      }
      return { ...acc, [key]: attr };
    }, {}) as Attrs;
  }

  private matchNode(node: DOMNode): NodeType | undefined {
    if (node.nodeType === TEXT_NODE) {
      return this.schema.textType;
    }
    if (node.nodeType !== ELEMENT_NODE) {
      return undefined;
    }
    const element = node as Element;
    return this.schema.nodes.find((type) => {
      return type.parseDOM.some((spec) => element.matches(spec.tag));
    });
  }

  private matchMark(node: DOMNode): MarkType | undefined {
    if (node.nodeType !== ELEMENT_NODE) {
      return undefined;
    }
    const element = node as Element;
    return this.schema.marks.find((type) => {
      return type.parseDOM.some((spec) => element.matches(spec.tag));
    });
  }
}
