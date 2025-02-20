import { Mark, Node } from '../../model';
import { Step } from './step';

export class RemoveMarkStep extends Step {
  constructor(
    readonly from: number,
    readonly to: number,
    readonly mark: Mark,
  ) {
    super();
  }

  apply(doc: Node): Node {
    const slice = doc.slice(this.from, this.to).map((node) => {
      return node.withMarks(node.marks.remove(this.mark));
    });
    return doc.replace(this.from, this.to, slice);
  }
}
