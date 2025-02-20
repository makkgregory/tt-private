import { Command } from "../../editor";
import { Attrs } from "../../model";
import { isMarkActive } from "../utils/is-mark-active";

export function toggleMark(type: string, attrs: Attrs = {}): Command {
  return ({ schema, state }) => {
    const mark = schema.mark(type, attrs);
    if (isMarkActive(state, mark.type, attrs)) {
      return state
        .tx()
        .removeMark(state.selection.from, state.selection.to, mark).state;
    }
    return state.tx().addMark(state.selection.from, state.selection.to, mark)
      .state;
  };
}
