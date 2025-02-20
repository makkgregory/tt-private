import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class EmailPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        email: {
          parseDOM: [{ tag: 'span[data-entity-type="MessageEntityEmail"]' }],
          toDOM: () => {
            const dom = document.createElement('span');
            dom.dataset.entityType = 'MessageEntityEmail';
            return dom;
          },
        },
      },
    };
  }
}
