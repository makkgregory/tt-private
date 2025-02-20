import { Command } from './command';

export function lift(): Command {
  return ({ state }) => {
    const { from, to } = state.selection;
    return state.tx().lift(from, to).state;
  };
}
