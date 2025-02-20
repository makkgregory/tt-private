import { compareDeep } from "../../lib/compare-deep";
import { hashCode } from "../../lib/hash-code";
import { Position } from "../position";
import { MarkType } from "../schema/mark-type";
import { NodeType } from "../schema/node-type";
import { Attrs } from "../schema/schema-spec";
import { Fragment } from "./fragment";
import { JSONNode } from "./json-ast";
import { MarkSet } from "./mark-set";
export class Node {
  private _hashCode = 0;

  constructor(
    readonly type: NodeType,
    readonly content = Fragment.EMPTY,
    readonly marks = MarkSet.EMPTY,
    readonly attrs: Attrs = {}
  ) {}

  get textContent(): string {
    return this.textBetween(0, this.content.size);
  }

  get childCount(): number {
    return this.content.count;
  }

  get size(): number {
    return this.type.leaf ? 1 : this.content.size + 2;
  }

  nodeAtPos(pos: number): Node | undefined {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    for (let node: Node | undefined = this; ; ) {
      const { index, offset } = node.content.findIndex(pos);
      node = node.maybeChild(index);
      if (!node) {
        return undefined;
      }
      if (offset == pos || node.type.text) {
        return node;
      }
      pos -= offset + 1;
    }
  }

  textBetween(from: number, to: number, blockSeparator = ""): string {
    return this.content.textBetween(from, to, blockSeparator);
  }

  hasMarkBetween(from: number, to: number, type: MarkType): boolean {
    let found = false;
    this.nodesBetween(from, to, (node) => {
      if (node.marks.has(type)) {
        found = true;
        return false;
      }
    });
    return found;
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
    startPos = 0
  ) {
    this.content.nodesBetween(from, to, callback, startPos, this);
  }

  child(index: number): Node {
    return this.content.child(index);
  }

  maybeChild(index: number): Node | undefined {
    return this.content.maybeChild(index);
  }

  slice(from: number, to: number): Fragment {
    const $from = this.resolve(from);
    const $to = this.resolve(to);
    const depth =
      $from.depth == $to.depth ? $from.depth : $from.sharedDepth(to);
    const start = $from.start(depth);
    const node = $from.node(depth);
    return node.content.cut($from.pos - start, $to.pos - start);
  }

  cut(from: number, to: number = this.content.size): Node {
    if (from == 0 && to == this.content.size) {
      return this;
    }
    const content = this.content.cut(from, to);
    return new Node(this.type, content, this.marks);
  }

  replace(from: number, to: number, slice: Fragment): Node {
    const $from = this.resolve(from);
    const $to = this.resolve(to);
    if ($from.parent !== $to.parent) {
      return this;
    }
    return this.replaceDepth($from, $to, slice, 0);
  }

  private replaceDepth(
    $from: Position,
    $to: Position,
    slice: Fragment,
    depth: number
  ): Node {
    if ($from.depth === depth) {
      const parent = $from.parent;
      const content = parent.content
        .cut(0, $from.parentOffset)
        .append(slice)
        .append(parent.content.cut($to.parentOffset));
      return parent.withContent(content);
    }
    const index = $from.index(depth);
    const child = this.replaceDepth($from, $to, slice, depth + 1);
    return this.withContent(this.content.replaceChild(index, child));
  }

  resolve(pos: number): Position {
    return Position.resolve(this, pos);
  }

  normalize(): Node {
    if (!this.content.count) {
      return this;
    }
    return new Node(
      this.type,
      this.content.normalize(),
      this.marks,
      this.attrs
    );
  }

  map(callback: (node: Node) => Node): Node {
    const copy = this.withContent(this.content.map(callback));
    return callback(copy);
  }

  withMarks(marks: MarkSet): Node {
    return this.copy(this.content, marks);
  }

  withContent(content: Fragment): Node {
    return this.copy(content);
  }

  copy(content = this.content, marks = this.marks): Node {
    return new Node(this.type, content, marks);
  }

  hashCode(): number {
    if (!this._hashCode) {
      const data = [
        this.type.name,
        this.marks.hashCode(),
        this.content.hashCode(),
        JSON.stringify(this.attrs),
      ].join("-");
      this._hashCode = hashCode(data);
    }
    return this._hashCode;
  }

  equals(other: Node): boolean {
    return this.hashCode() === other.hashCode();
  }

  sameMarkup(other: Node): boolean {
    return this.hasMarkup(other.type, other.marks, other.attrs);
  }

  hasMarkup(type: NodeType, marks: MarkSet, attrs = this.attrs): boolean {
    return (
      this.type === type &&
      this.marks.equals(marks) &&
      compareDeep(this.attrs, attrs)
    );
  }

  toJSON(): JSONNode {
    const json: JSONNode = { type: this.type.name };
    if (!this.content.isEmpty) {
      json.content = this.content.toJSON();
    }
    if (!this.marks.isEmpty) {
      json.marks = this.marks.toJSON();
    }
    if (Object.keys(this.attrs).length) {
      json.attrs = this.attrs;
    }
    return json;
  }
}
