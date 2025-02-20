import { Attrs, Schema } from '../../model';
import { EditorState } from '../../state';
import { isMarkActive } from './is-mark-active';
import { isNodeActive } from './is-node-active';

export const isActive = (
  schema: Schema,
  state: EditorState,
  type: string,
  attrs?: Attrs,
) => {
  const nodeType = schema.maybeNodeType(type);
  const markType = schema.maybeMarkType(type);
  if (nodeType) {
    return isNodeActive(state, nodeType, attrs);
  }
  if (markType) {
    return isMarkActive(state, markType, attrs);
  }
  return false;
};
