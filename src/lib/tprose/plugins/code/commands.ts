import { Command, toggleMark } from '../../editor';

export function toggleCode(): Command {
  return toggleMark('code');
}
