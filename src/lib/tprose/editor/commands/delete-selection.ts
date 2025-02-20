import { Command } from '../../editor';
import { Fragment } from '../../model';

export function deleteSelection(): Command {
  return ({ state }) => {
    const { from, to } = state.selection;
    return state.tx().replace(from, to, Fragment.EMPTY).state;
  };
}
