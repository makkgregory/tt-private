import { hashCode } from "../../lib/hash-code";
import { JSONNode } from "./json-ast";
import { Node } from "./node";
import { TextNode } from "./text-node";

export class Fragment implements Iterable<Node> {
  static readonly EMPTY = new Fragment([]);

  private _hashCode = 0;

  constructor(readonly nodes: readonly Node[]) {}

  get isEmpty(): boolean {
    return this.count === 0;
  }

  get firstChild(): Node | undefined {
    return this.nodes.at(0);
  }

  get lastChild(): Node | undefined {
    return this.nodes.at(-1);
  }

  get count(): number {
    return this.nodes.length;
  }

  get size(): number {
    return this.nodes.reduce((size, node) => size + node.size, 0);
  }

  textBetween(from: number, to: number, blockSeparator = ""): string {
    let text = "";
    let first = true;

    this.nodesBetween(from, to, (node, pos) => {
      if (node instanceof TextNode) {
        text += node.text.slice(Math.max(from, pos) - pos, to - pos);
        return;
      }
      if (node.type.leaf) {
        text += node.type.leafText(node);
        return;
      }
      if (node.type.block) {
        if (first) {
          first = false;
        } else {
          text += blockSeparator;
        }
      }
    });
    return text;
  }

  nodesBetween(
    from: number,
    to: number,
    callback: (
      node: Node,
      pos: number,
      parent: Node | undefined,
      index: number
    ) => void | boolean,
    nodeStart = 0,
    parent?: Node
  ): void {
    for (let i = 0, pos = 0; pos < to; i++) {
      const child = this.child(i);
      const end = pos + child.size;
      if (
        end > from &&
        callback(child, nodeStart + pos, parent, i) !== false &&
        child.content.size
      ) {
        const start = pos + 1;
        child.nodesBetween(
          Math.max(0, from - start),
          Math.min(child.content.size, to - start),
          callback,
          nodeStart + start
        );
      }
      pos = end;
    }
  }

  cut(from: number, to = this.size): Fragment {
    if (from == 0 && to == this.size) {
      return this;
    }
    const result: Node[] = [];
    if (to > from) {
      for (let i = 0, pos = 0; pos < to; i++) {
        let child = this.child(i);
        const end = pos + child.size;
        if (end > from) {
          if (pos < from || end > to) {
            if (child instanceof TextNode) {
              child = child.cut(
                Math.max(0, from - pos),
                Math.min(child.text.length, to - pos)
              );
            } else {
              child = child.cut(
                Math.max(0, from - pos - 1),
                Math.min(child.content.size, to - pos - 1)
              );
            }
          }
          result.push(child);
        }
        pos = end;
      }
    }
    return new Fragment(result);
  }

  append(other: Fragment): Fragment {
    if (!other.size) {
      return this;
    }
    if (!this.size) {
      return other;
    }
    const first = other.firstChild;
    const last = this.lastChild;
    const nodes = this.nodes.slice();
    let i = 0;
    if (
      first instanceof TextNode &&
      last instanceof TextNode &&
      last.sameMarkup(first)
    ) {
      nodes[nodes.length - 1] = last.withText(last.text! + first.text!);
      i = 1;
    }
    for (; i < other.nodes.length; i++) {
      nodes.push(other.nodes[i]);
    }
    return new Fragment(nodes);
  }

  replaceChild(index: number, node: Node) {
    const child = this.child(index);
    if (child === node) {
      return this;
    }
    const nodes = this.nodes.slice();
    nodes[index] = node;
    return new Fragment(nodes);
  }

  normalize(): Fragment {
    const nodes = this.nodes
      .map((node) => node.normalize())
      .reduce((nodes, node) => {
        const prev = nodes.at(-1);
        if (
          prev instanceof TextNode &&
          node instanceof TextNode &&
          prev.sameMarkup(node)
        ) {
          nodes[nodes.length - 1] = prev.withText(prev.text + node.text);
          return nodes;
        }
        nodes.push(node);
        return nodes;
      }, [] as Node[]);
    return new Fragment(nodes);
  }

  findIndex(pos: number): { index: number; offset: number } {
    if (pos === 0) {
      return { index: 0, offset: pos };
    }
    if (pos === this.size) {
      return { index: this.count, offset: pos };
    }
    if (pos > this.size || pos < 0) {
      throw new RangeError(`Position ${pos} is out of range`);
    }
    for (let i = 0, currPos = 0; ; i++) {
      const curr = this.child(i);
      const end = currPos + curr.size;
      if (end >= pos) {
        if (end == pos) {
          return { index: i + 1, offset: end };
        }
        return { index: i, offset: currPos };
      }
      currPos = end;
    }
  }

  child(index: number): Node {
    const child = this.nodes[index];
    if (!child) {
      throw new RangeError(`Index ${index} is out of range`);
    }
    return child;
  }

  maybeChild(index: number): Node | undefined {
    return this.nodes[index];
  }

  map(callback: (node: Node) => Node): Fragment {
    const nodes = this.nodes.map((node) => node.map(callback));
    return new Fragment(nodes);
  }

  hashCode(): number {
    if (!this._hashCode) {
      const data = this.nodes.map((node) => node.hashCode()).join("-");
      this._hashCode = hashCode(data);
    }
    return this._hashCode;
  }

  equals(other: Fragment): boolean {
    return this.hashCode() === other.hashCode();
  }

  toJSON(): JSONNode[] {
    return this.nodes.map((node) => node.toJSON());
  }

  [Symbol.iterator](): Iterator<Node> {
    return this.nodes[Symbol.iterator]();
  }
}
