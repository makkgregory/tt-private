import { Command } from './command';

export function setOrigin(origin: string): Command {
  return ({ state }) => state.tx(origin).state;
}
