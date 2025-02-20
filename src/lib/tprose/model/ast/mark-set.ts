import { compareDeep } from "../../lib/compare-deep";
import { hashCode } from "../../lib/hash-code";
import { MarkType } from "../schema/mark-type";
import { Attrs } from "../schema/schema-spec";
import { JSONMark } from "./json-ast";
import { Mark } from "./mark";

export class MarkSet implements Iterable<Mark> {
  private _hashCode = 0;
  private readonly marks: Map<string, Mark>;

  static readonly EMPTY = new MarkSet([]);

  constructor(marks: Mark[]) {
    this.marks = new Map(marks.map((mark) => [mark.type.name, mark]));
  }

  get isEmpty(): boolean {
    return this.count === 0;
  }

  get count(): number {
    return this.marks.size;
  }

  add(mark: Mark): MarkSet {
    if (this.has(mark.type)) {
      return this;
    }
    return new MarkSet([...this.marks.values(), mark]);
  }

  remove(mark: Mark): MarkSet {
    if (!this.has(mark.type)) {
      return this;
    }
    const copy = new Map(this.marks);
    copy.delete(mark.type.name);
    return new MarkSet(Array.from(copy.values()));
  }

  has(type: MarkType, attrs: Attrs = {}): boolean {
    const mark = this.marks.get(type.name);
    if (!mark) {
      return false;
    }
    return Object.entries(attrs).every(([key, value]) =>
      compareDeep(mark.attrs[key], value)
    );
  }

  hashCode(): number {
    if (!this._hashCode) {
      const data = this.toArray()
        .map((mark) => mark.hashCode())
        .join("-");
      this._hashCode = hashCode(data);
    }
    return this._hashCode;
  }

  toJSON(): JSONMark[] {
    return this.toArray().map((mark) => mark.toJSON());
  }

  equals(other: MarkSet): boolean {
    return this.hashCode() === other.hashCode();
  }

  toArray(): Mark[] {
    return Array.from(this.marks.values());
  }

  [Symbol.iterator](): Iterator<Mark> {
    return this.marks.values();
  }
}
