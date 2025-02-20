import { Command } from "../../editor";
import { Attrs } from "../../model";

export function insertContent(type: string, attrs: Attrs = {}): Command {
  return ({ schema, state }) => {
    const { from, to } = state.selection;
    const node = schema.nodeType(type).create(undefined, undefined, attrs);
    return state.tx().replaceWith(from, to, node).state;
  };
}
