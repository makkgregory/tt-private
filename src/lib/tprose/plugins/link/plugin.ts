import { InputRule, MarkInputRule, Plugin } from '../../editor';
import { Schema, SchemaSpec } from '../../model';

export const pasteRegex =
  /https?:\/\/(?:www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z]{2,}\b(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)(?:[-a-zA-Z0-9@:%._+~#=?!&/]*)/gi;

export class LinkPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        link: {
          attrs: {
            href: { default: '' },
          },
          parseDOM: [{ tag: 'a[href]' }],
          toDOM: () => {
            return document.createElement('a');
          },
        },
      },
    };
  }

  pasteRules(schema: Schema): InputRule[] {
    return [
      new MarkInputRule(pasteRegex, schema.markType('link'), (match) => {
        return { href: match };
      }),
    ];
  }
}
