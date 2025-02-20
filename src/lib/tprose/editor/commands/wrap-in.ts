import { Command } from '../../editor';
import { Attrs } from '../../model';

export function wrapIn(type: string, attrs: Attrs = {}): Command {
  return ({ schema, state }) => {
    const { from, to } = state.selection;
    return state.tx().wrap(from, to, schema.nodeType(type), attrs).state;
  };
}
