import { Fragment } from "../ast/fragment";
import { Mark } from "../ast/mark";
import { Node } from "../ast/node";
import { Attrs } from "../schema/schema-spec";
import { DOMNode, ELEMENT_NODE } from "./dom-node";

export class DOMSerializer {
  serialize(node: Node): DOMNode {
    const dom: DOMNode = node.type.toDOM(node);
    dom.tProseType = node.type;
    this.serializeAttrs(dom, node.attrs, node.type.defaultAttrs);
    this.serializeFragment(node.content, dom);
    const result = node.marks.toArray().reduce((acc, mark) => {
      const markDom = this.serializeMark(mark);
      markDom.appendChild(acc);
      return markDom;
    }, dom);
    this.ensureTrailingHack(node, dom);
    return result;
  }

  ensureTrailingHack(node: Node, dom: DOMNode) {
    if (!node.type.block) {
      return;
    }
    if (this.hasTrailingHack(dom)) {
      return;
    }
    const br = document.createElement("br");
    br.classList.add("tprose-trailing-hack");
    dom.appendChild(br);
  }

  hasTrailingHack(dom: DOMNode): boolean {
    if (dom.lastChild?.nodeType !== ELEMENT_NODE) {
      return false;
    }
    const element = dom.lastChild as Element;
    return (
      element.tagName === "BR" &&
      element.classList.contains("tprose-trailing-hack")
    );
  }

  private serializeMark(mark: Mark): DOMNode {
    const dom: DOMNode = mark.type.toDOM(mark);
    dom.tProseType = mark.type;
    this.serializeAttrs(dom, mark.attrs, mark.type.defaultAttrs);
    return dom;
  }

  private serializeFragment(fragment: Fragment, output: DOMNode) {
    for (let i = 0; i < fragment.nodes.length; i++) {
      const child = fragment.nodes[i];
      const childDom = this.serialize(child);
      output.appendChild(childDom);
    }
  }

  private serializeAttrs(dom: DOMNode, attrs: Attrs, defaultAttrs: Attrs) {
    if (dom.nodeType !== ELEMENT_NODE) {
      return;
    }
    const element = dom as HTMLElement;
    Object.entries(defaultAttrs).forEach(([key, defaultValue]) => {
      const value = attrs[key] ?? defaultValue;
      element.setAttribute(key, String(value));
    });
  }
}
