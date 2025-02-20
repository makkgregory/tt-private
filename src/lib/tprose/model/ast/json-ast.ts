import { Attrs } from '../schema/schema-spec';

export interface JSONNode {
  type: string;
  text?: string;
  marks?: JSONMark[];
  attrs?: Attrs;
  content?: JSONNode[];
}

export interface JSONMark {
  type: string;
  attrs?: Attrs;
}
