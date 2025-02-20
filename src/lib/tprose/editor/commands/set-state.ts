import { EditorState } from '../../state';
import { Command } from './command';

export function setState(state: EditorState): Command {
  return () => state;
}
