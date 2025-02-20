import { Position } from '../model';

export class SelectionRange {
  constructor(
    readonly $from: Position,
    readonly $to: Position,
  ) {}

  static from($anchor: Position, $head: Position): SelectionRange {
    return new SelectionRange(
      Position.min($anchor, $head),
      Position.max($anchor, $head),
    );
  }

  get from(): number {
    return this.$from.pos;
  }

  get to(): number {
    return this.$to.pos;
  }

  get empty(): boolean {
    return this.$from.pos === this.$to.pos;
  }

  equals(other: SelectionRange): boolean {
    return this.from == other.from && this.to == other.to;
  }
}
