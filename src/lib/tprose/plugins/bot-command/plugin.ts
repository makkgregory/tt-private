import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class BotCommandPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        botCommand: {
          parseDOM: [
            { tag: 'span[data-entity-type="MessageEntityBotCommand"]' },
          ],
          toDOM: () => {
            const dom = document.createElement('span');
            dom.dataset.entityType = 'MessageEntityBotCommand';
            return dom;
          },
        },
      },
    };
  }
}
