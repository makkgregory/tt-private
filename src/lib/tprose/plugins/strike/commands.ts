import { Command, toggleMark } from '../../editor';

export function toggleStrike(): Command {
  return toggleMark('strike');
}
