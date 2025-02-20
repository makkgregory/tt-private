import { Node } from '../model';
import { Selection } from './selection';
import { Transaction } from './transaction';

export const ORIGIN_DEFAULT = 'default';

export class EditorState {
  constructor(
    readonly doc: Node,
    readonly selection: Selection,
    readonly origin: string,
  ) {}

  tx(origin = ORIGIN_DEFAULT): Transaction {
    const state = new EditorState(this.doc, this.selection, origin);
    return Transaction.create(state);
  }

  equals(other: EditorState): boolean {
    if (this === other) {
      return true;
    }
    return (
      this.doc.equals(other.doc) &&
      this.selection.equals(other.selection) &&
      this.origin === other.origin
    );
  }
}
