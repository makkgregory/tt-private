import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class HashTagPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        hashTag: {
          parseDOM: [{ tag: 'span[data-entity-type="MessageEntityHashTag"]' }],
          toDOM: () => {
            const dom = document.createElement('span');
            dom.dataset.entityType = 'MessageEntityHashTag';
            return dom;
          },
        },
      },
    };
  }
}
