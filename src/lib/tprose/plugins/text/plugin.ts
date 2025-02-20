import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class TextPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      nodes: {
        text: {
          text: true,
          toDOM: (node) => {
            return document.createTextNode(node.textContent);
          },
        },
      },
    };
  }
}
