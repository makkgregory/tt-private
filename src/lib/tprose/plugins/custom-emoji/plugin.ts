import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class CustomEmojiPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      nodes: {
        customEmoji: {
          inline: true,
          leaf: true,
          marks: [],
          attrs: {
            src: { default: '' },
          },
          parseDOM: [
            { tag: 'img[data-entity-type="MessageEntityCustomEmoji"]' },
          ],
          toDOM: () => {
            const dom = document.createElement('img');
            dom.setAttribute('data-entity-type', 'MessageEntityCustomEmoji');
            dom.style.margin = '0';
            dom.style.width = '1.25rem';
            dom.style.height = '1.25rem';
            dom.style.pointerEvents = 'none';
            dom.style.display = 'inline-block';
            dom.style.verticalAlign = 'text-top';
            dom.draggable = false;
            dom.contentEditable = 'false';
            return dom;
          },
        },
      },
    };
  }
}
