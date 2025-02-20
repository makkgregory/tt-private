import { Node } from '../../model';
import { Mapping } from '../mapping';

export abstract class Step {
  abstract apply(doc: Node): Node;

  mapping(mapping: Mapping): Mapping {
    return mapping;
  }
}
