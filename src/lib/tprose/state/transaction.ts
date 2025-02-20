import { Node } from "../model";
import { Mapping, Transform } from "../transform";
import { EditorState } from "./editor-state";
import { Selection } from "./selection";

export class Transaction extends Transform {
  constructor(
    readonly state: EditorState,
    mapping: Mapping,
    prev: Transform | undefined
  ) {
    super(state.doc, mapping, prev);
  }

  get originalState(): EditorState {
    return this.prev instanceof Transaction
      ? this.prev.originalState
      : this.state;
  }

  static create(state: EditorState): Transaction {
    return new Transaction(state, Mapping.EMPTY, undefined);
  }

  select(selection: Selection): this {
    const state = new EditorState(this.state.doc, selection, this.state.origin);
    return new Transaction(state, this.mapping, this) as this;
  }

  protected next(doc: Node, mapping: Mapping): this {
    const state = new EditorState(
      doc,
      this.originalState.selection.map(doc, mapping),
      this.state.origin
    );
    return new Transaction(state, mapping, this) as this;
  }
}
