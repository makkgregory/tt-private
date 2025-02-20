import { JSONNode } from '../../model';
import { EditorState, ORIGIN_DEFAULT, Selection } from '../../state';
import { Command } from './command';

export function setContent(content: JSONNode): Command {
  return ({ schema }) => {
    const doc = schema.nodeFromJSON(content);
    const selection = Selection.create(doc, 0);
    return new EditorState(doc, selection, ORIGIN_DEFAULT);
  };
}
