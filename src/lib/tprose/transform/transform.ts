/* eslint-disable @typescript-eslint/no-this-alias */
import { Attrs, Fragment, Mark, Node, NodeType } from '../model';
import { Mapping } from './mapping';
import { AddMarkStep } from './steps/add-mark-step';
import { RemoveMarkStep } from './steps/remove-mark-step';
import { ReplaceStep } from './steps/replace-step';
import { Step } from './steps/step';

export abstract class Transform {
  constructor(
    readonly doc: Node,
    readonly mapping: Mapping,
    readonly prev: Transform | undefined,
  ) {}

  get before(): Node {
    return this.prev?.doc ?? this.doc;
  }

  addMark(from: number, to: number, mark: Mark): this {
    let head = this;
    this.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.type.supportsMark(mark.type)) {
        return;
      }
      if (node.marks.has(mark.type)) {
        return;
      }
      const start = Math.max(pos, from);
      const end = Math.min(pos + node.size, to);
      head = head.step(new AddMarkStep(start, end, mark));
    });
    return head;
  }

  removeMark(from: number, to: number, mark: Mark): this {
    let head = this;
    this.doc.nodesBetween(from, to, (node, pos) => {
      if (!node.marks.has(mark.type)) {
        return;
      }
      const start = Math.max(pos, from);
      const end = Math.min(pos + node.size, to);
      head = head.step(new RemoveMarkStep(start, end, mark));
    });
    return head;
  }

  replace(from: number, to: number, slice: Fragment): this {
    return this.step(new ReplaceStep(from, to, slice));
  }

  replaceWith(from: number, to: number, node: Node): this {
    return this.replace(from, to, new Fragment([node]));
  }

  delete(from: number, to: number): this {
    return this.replace(from, to, Fragment.EMPTY);
  }

  wrap(from: number, to: number, type: NodeType, attrs: Attrs = {}): this {
    const content = this.doc.slice(from, to);
    const wrapper = type.create(content, undefined, attrs);
    return this.step(new ReplaceStep(from, to, new Fragment([wrapper])));
  }

  lift(from: number, to: number): this {
    let head = this;
    this.doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.leaf) {
        return;
      }
      const start = head.mapping.map(pos);
      const end = head.mapping.map(pos + node.size);
      head = head.step(new ReplaceStep(start, end, node.content));
    });
    return head;
  }

  normalize(): this {
    return this.next(this.doc.normalize(), this.mapping);
  }

  private step(step: Step): this {
    const doc = step.apply(this.doc);
    const mapping = step.mapping(this.mapping);
    return this.next(doc, mapping);
  }

  protected abstract next(doc: Node, mapping: Mapping): this;
}
