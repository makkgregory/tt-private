import { Fragment, Node, Position } from "../model";
import { Mapping } from "../transform";
import { SelectionRange } from "./selection-range";

export class Selection {
  constructor(
    readonly $anchor: Position,
    readonly $head: Position,
    readonly ranges: readonly SelectionRange[]
  ) {
    if (ranges.length === 0) {
      throw new Error("Selection must have at least one range");
    }
  }

  get anchor(): number {
    return this.$anchor.pos;
  }

  get head(): number {
    return this.$head.pos;
  }

  get from(): number {
    return this.$from.pos;
  }

  get to(): number {
    return this.$to.pos;
  }

  get $from(): Position {
    return this.ranges[0].$from;
  }

  get $to(): Position {
    return this.ranges[0].$to;
  }

  get $cursor(): Position | null {
    return this.anchor === this.head ? this.$head : null;
  }

  get empty(): boolean {
    return this.ranges.every((range) => range.empty);
  }

  get doc(): Node {
    return this.$from.doc;
  }

  static create(doc: Node, anchor: number, head = anchor): Selection {
    const $anchor = doc.resolve(anchor);
    const $head = doc.resolve(head);
    const ranges = [SelectionRange.from($anchor, $head)];
    return new Selection($anchor, $head, ranges);
  }

  map(doc: Node, mapping: Mapping): Selection {
    const head = mapping.map(this.head);
    const anchor = mapping.map(this.anchor);
    return Selection.create(doc, anchor, head);
  }

  content(): Fragment {
    return this.$from.doc.slice(this.from, this.to);
  }

  equals(other: Selection): boolean {
    if (this === other) {
      return true;
    }
    if (this.ranges.length !== other.ranges.length) {
      return false;
    }
    return this.ranges.every((range, i) => range.equals(other.ranges[i]));
  }
}
