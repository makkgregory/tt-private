import { Command, setOrigin } from "../../editor";
import { History, ORIGIN_HISTORY } from "./history";

export function historyUndo(history: History): Command {
  return ({ state, ...rest }) => {
    const next = history.undo() ?? state;
    return setOrigin(ORIGIN_HISTORY)({ state: next, ...rest });
  };
}

export function historyRedo(history: History): Command {
  return ({ state, ...rest }) => {
    const next = history.redo() ?? state;
    return setOrigin(ORIGIN_HISTORY)({ state: next, ...rest });
  };
}
