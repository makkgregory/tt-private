import { Command, toggleMark } from '../../editor';

export function toggleBold(): Command {
  return toggleMark('bold');
}
