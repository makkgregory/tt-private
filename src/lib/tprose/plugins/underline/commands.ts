import { Command, toggleMark } from '../../editor';

export function toggleUnderline(): Command {
  return toggleMark('underline');
}
