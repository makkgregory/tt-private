import { Plugin } from '../../editor';
import { SchemaSpec } from '../../model';

export class BankCardPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        bankCard: {
          parseDOM: [{ tag: 'span[data-entity-type="MessageEntityBankCard"]' }],
          toDOM: () => {
            const dom = document.createElement('span');
            dom.dataset.entityType = 'MessageEntityBankCard';
            return dom;
          },
        },
      },
    };
  }
}
