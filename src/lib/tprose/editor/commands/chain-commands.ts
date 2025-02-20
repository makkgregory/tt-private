import { Command } from '../../editor';

export function chainCommands(...commands: Command[]): Command {
  return ({ state, ...rest }) => {
    return commands.reduce(
      (state, command) => command({ state, ...rest }),
      state,
    );
  };
}
