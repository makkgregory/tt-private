import { Command, toggleMark } from '../../editor';

export function toggleItalic(): Command {
  return toggleMark('italic');
}
