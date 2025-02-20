import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class MentionPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        mention: {
          parseDOM: [{ tag: 'span[data-entity-type="MessageEntityMention"]' }],
          toDOM: () => {
            const dom = document.createElement('span');
            dom.dataset.entityType = 'MessageEntityMention';
            return dom;
          },
        },
      },
    };
  }
}
