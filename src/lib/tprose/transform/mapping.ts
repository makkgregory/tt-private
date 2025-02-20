export class Mapping {
  static readonly EMPTY = new Mapping(0, 0, 0, undefined);

  constructor(
    readonly start: number,
    readonly oldSize: number,
    readonly newSize: number,
    readonly prev: Mapping | undefined,
  ) {}

  map(pos: number): number {
    pos = this.prev?.map(pos) ?? pos;
    if (this.start > pos) {
      return pos;
    }
    const diff = this.newSize - this.oldSize;
    return pos + diff;
  }

  next(start: number, oldSize: number, newSize: number): Mapping {
    return new Mapping(start, oldSize, newSize, this);
  }
}
