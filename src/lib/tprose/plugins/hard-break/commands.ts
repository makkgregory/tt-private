import { Command, insertContent } from '../../editor';

export function setHardBreak(): Command {
  return insertContent('hardBreak');
}
