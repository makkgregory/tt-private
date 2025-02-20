import { Command, toggleMark } from '../../editor';

export function toggleLink(href: string): Command {
  return toggleMark('link', { href });
}
