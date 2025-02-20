import { Fragment, Node } from '../../model';
import { Mapping } from '../mapping';
import { Step } from './step';

export class ReplaceStep extends Step {
  constructor(
    readonly from: number,
    readonly to: number,
    readonly slice: Fragment,
  ) {
    super();
  }

  mapping(mapping: Mapping): Mapping {
    return mapping.next(this.from, this.to - this.from, this.slice.size);
  }

  apply(doc: Node): Node {
    return doc.replace(this.from, this.to, this.slice);
  }
}
