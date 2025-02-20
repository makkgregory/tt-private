import { Selection } from "../../state";
import { Command } from "./command";

export function setSelectionRange(from: number, to = from): Command {
  return ({ state, ...rest }) => {
    const selection = Selection.create(state.doc, from, to);
    return setSelection(selection)({ state, ...rest });
  };
}

export function setSelection(selection: Selection): Command {
  return ({ state }) => {
    return state.tx().select(selection).state;
  };
}

export function selectEnd(): Command {
  return ({ state }) => {
    const selection = Selection.create(state.doc, state.doc.content.size);
    return state.tx().select(selection).state;
  };
}
