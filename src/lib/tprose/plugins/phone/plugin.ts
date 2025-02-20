import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class PhonePlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        phone: {
          parseDOM: [{ tag: 'span[data-entity-type="MessageEntityPhone"]' }],
          toDOM: () => {
            const dom = document.createElement('span');
            dom.dataset.entityType = 'MessageEntityPhone';
            return dom;
          },
        },
      },
    };
  }
}
