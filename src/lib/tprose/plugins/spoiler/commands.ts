import { Command, toggleMark } from '../../editor';

export function toggleSpoiler(): Command {
  return toggleMark('spoiler');
}
