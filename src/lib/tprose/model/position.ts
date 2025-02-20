import { MarkSet } from './ast/mark-set';
import { Node } from './ast/node';
import { TextNode } from './ast/text-node';

export class Position {
  private constructor(
    readonly pos: number,
    readonly path: PathItem[],
    readonly parentOffset: number,
  ) {}

  static min(...positions: Position[]): Position {
    return positions.reduce((min, pos) => (pos.pos < min.pos ? pos : min));
  }

  static max(...positions: Position[]): Position {
    return positions.reduce((max, pos) => (pos.pos > max.pos ? pos : max));
  }

  static resolve(doc: Node, pos: number): Position {
    if (pos < 0 && pos > doc.content.size) {
      throw new RangeError(`Position ${pos} is out of range`);
    }
    const path: PathItem[] = [];
    let start = 0;
    let parentOffset = pos;
    for (let node = doc; ; ) {
      const { index, offset } = node.content.findIndex(parentOffset);
      const rem = parentOffset - offset;
      path.push({ node, index, pos: start + offset });
      if (!rem) {
        break;
      }
      node = node.child(index);
      if (node instanceof TextNode) {
        break;
      }
      parentOffset = rem - 1;
      start += offset + 1;
    }
    return new Position(pos, path, parentOffset);
  }

  get depth(): number {
    return this.path.length - 1;
  }

  get parent(): Node {
    return this.node(this.depth);
  }

  get target(): Node | undefined {
    return this.parent.maybeChild(this.index());
  }

  get marks(): MarkSet {
    return this.target?.marks ?? MarkSet.EMPTY;
  }

  get doc(): Node {
    return this.node(0);
  }

  get textOffset(): number {
    return this.pos - this.path[this.depth].pos;
  }

  get nodeAfter(): Node | undefined {
    const index = this.index();
    if (index === this.parent.childCount) {
      return undefined;
    }
    if (this.textOffset) {
      return this.parent.child(index).cut(this.textOffset);
    }
    return this.parent.child(index);
  }

  get nodeBefore(): Node | undefined {
    const index = this.index();
    if (this.textOffset) {
      return this.parent.child(index).cut(0, this.textOffset);
    }
    if (index === 0) {
      return undefined;
    }
    return this.parent.child(index - 1);
  }

  node(depth: number): Node {
    if (depth < 0 || depth > this.depth) {
      throw new RangeError(
        `The depth ${depth} is outside the range of this resolved position`,
      );
    }
    return this.path[depth].node;
  }

  index(depth = this.depth): number {
    if (depth < 0 || depth > this.depth) {
      throw new RangeError(
        `The depth ${depth} is outside the range of this resolved position`,
      );
    }
    return this.path[depth].index;
  }

  start(depth = this.depth): number {
    if (depth === 0) {
      return 0;
    }
    return this.path[depth - 1].pos + 1;
  }

  end(depth = this.depth): number {
    return this.start(depth) + this.node(depth).content.size;
  }

  before(depth = this.depth): number {
    if (depth === 0) {
      throw new RangeError('There is no position before the doc node');
    }
    return depth === this.depth + 1 ? this.pos : this.path[depth - 1].pos;
  }

  after(depth = this.depth): number {
    if (depth === 0) {
      throw new RangeError('There is no position after the doc node');
    }
    return depth === this.depth + 1
      ? this.pos
      : this.path[depth - 1].pos + this.node(depth).size;
  }

  sharedDepth(pos: number) {
    for (let depth = this.depth; depth > 0; depth--) {
      if (this.start(depth) < pos && this.end(depth) > pos) {
        return depth;
      }
    }
    return 0;
  }
}

interface PathItem {
  node: Node;
  index: number;
  pos: number;
}
