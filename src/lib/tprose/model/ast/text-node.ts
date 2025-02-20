import { hashCode } from '../../lib/hash-code';
import { NodeType } from '../schema/node-type';
import { Fragment } from './fragment';
import { JSONNode } from './json-ast';
import { MarkSet } from './mark-set';
import { Node } from './node';

export class TextNode extends Node {
  constructor(
    type: NodeType,
    readonly text: string,
    marks = MarkSet.EMPTY,
  ) {
    super(type, Fragment.EMPTY, marks);
    if (!text.length) {
      throw new Error('Cannot create a text node with an empty string');
    }
  }

  get textContent(): string {
    return this.text;
  }

  get size(): number {
    return this.text.length;
  }

  textBetween(from: number, to: number): string {
    return this.text.slice(from, to);
  }

  cut(from: number, to: number) {
    if (from === 0 && to === this.text.length) {
      return this;
    }
    const text = this.text.slice(from, to);
    return new TextNode(this.type, text, this.marks);
  }

  copy(
    _content = this.content,
    marks = this.marks,
    text = this.text,
  ): TextNode {
    return new TextNode(this.type, text, marks);
  }

  withText(text: string) {
    return this.copy(undefined, undefined, text);
  }

  hashCode(): number {
    const data = [this.type.name, this.marks.hashCode(), this.text].join('-');
    return hashCode(data);
  }

  toJSON(): JSONNode {
    return { ...super.toJSON(), text: this.text };
  }
}
