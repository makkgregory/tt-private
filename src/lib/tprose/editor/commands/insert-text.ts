import { Command } from '..';

export function insertText(text: string): Command {
  return ({ schema, state }) => {
    const { from, to } = state.selection;
    const node = schema.text(text);
    return state.tx().delete(from, to).replaceWith(from, from, node).state;
  };
}
