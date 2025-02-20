import { hashCode } from '../../lib/hash-code';
import { MarkType } from '../schema/mark-type';
import { Attrs } from '../schema/schema-spec';
import { JSONMark } from './json-ast';

export class Mark {
  private _hashCode = 0;

  constructor(
    readonly type: MarkType,
    readonly attrs: Attrs = {},
  ) {}

  hashCode(): number {
    if (!this._hashCode) {
      this._hashCode = hashCode(this.type.name);
    }
    return this._hashCode;
  }

  equals(other: Mark): boolean {
    return this.hashCode() === other.hashCode();
  }

  toJSON(): JSONMark {
    const json: JSONMark = {
      type: this.type.name,
    };
    if (Object.keys(this.attrs).length) {
      json.attrs = this.attrs;
    }
    return json;
  }
}
