import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class DocumentPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      nodes: {
        doc: {
          root: true,
        },
      },
    };
  }
}
