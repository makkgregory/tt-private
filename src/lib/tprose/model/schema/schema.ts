import { Fragment } from '../ast/fragment';
import { JSONMark, JSONNode } from '../ast/json-ast';
import { Mark } from '../ast/mark';
import { MarkSet } from '../ast/mark-set';
import { Node } from '../ast/node';
import { TextNode } from '../ast/text-node';
import { MarkType } from './mark-type';
import { NodeType } from './node-type';
import { Attrs, SchemaSpec } from './schema-spec';

export class Schema {
  private readonly nodeMap: Record<string, NodeType>;
  private readonly markMap: Record<string, MarkType>;

  constructor(
    readonly docType: NodeType,
    readonly textType: NodeType,
    readonly nodes: NodeType[],
    readonly marks: MarkType[],
  ) {
    this.nodeMap = nodes.reduce(
      (acc, node) => ({ ...acc, [node.name]: node }),
      {},
    );
    this.markMap = marks.reduce(
      (acc, mark) => ({ ...acc, [mark.name]: mark }),
      {},
    );
  }

  static fromSpec(spec: SchemaSpec): Schema {
    const nodes = Object.entries(spec.nodes ?? {}).map(
      ([name, spec]) => new NodeType(name, spec),
    );
    const marks = Object.entries(spec.marks ?? []).map(
      ([name, spec]) => new MarkType(name, spec),
    );
    const docNode = nodes.find((node) => node.root);
    if (!docNode) {
      throw new Error('Schema must have a root node');
    }
    const textNode = nodes.find((node) => node.text);
    if (!textNode) {
      throw new Error('Schema must have a text node');
    }
    return new Schema(docNode, textNode, nodes, marks);
  }

  doc(content = Fragment.EMPTY): Node {
    return new Node(this.docType, content);
  }

  text(text: string, marks = MarkSet.EMPTY): Node {
    return new TextNode(this.textType, text, marks);
  }

  node(
    name: string,
    content = Fragment.EMPTY,
    marks = MarkSet.EMPTY,
    attrs: Attrs = {},
  ): Node {
    return this.nodeType(name).create(content, marks, attrs);
  }

  fragment(nodes: Node[]): Fragment {
    return new Fragment(nodes);
  }

  mark(name: string, attrs: Attrs = {}): Mark {
    return this.markType(name).create(attrs);
  }

  markList(marks: Mark[]): MarkSet {
    return new MarkSet(marks);
  }

  nodeFromJSON({
    type,
    text,
    marks = [],
    content = [],
    attrs = {},
  }: JSONNode): Node {
    if (text) {
      return this.text(
        text,
        this.markList(marks.map((mark) => this.markFromJSON(mark))),
      );
    }
    return this.node(
      type,
      this.fragment(content.map((node) => this.nodeFromJSON(node))),
      this.markList(marks.map((mark) => this.markFromJSON(mark))),
      attrs,
    );
  }

  markFromJSON(json: JSONMark): Mark {
    return this.mark(json.type, json.attrs);
  }

  nodeType(name: string): NodeType {
    const nodeType = this.nodeMap[name];
    if (!nodeType) {
      throw new Error(`Node type ${name} not found in schema`);
    }
    return nodeType;
  }

  maybeNodeType(name: string): NodeType | undefined {
    return this.nodeMap[name];
  }

  markType(name: string): MarkType {
    const markType = this.markMap[name];
    if (!markType) {
      throw new Error(`Mark type ${name} not found in schema`);
    }
    return markType;
  }

  maybeMarkType(name: string): MarkType | undefined {
    return this.markMap[name];
  }
}
