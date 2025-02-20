import { Schema } from "../../model";
import { EditorState } from "../../state";
import { getMarkAttrs } from "./get-mark-attrs";
import { getNodeAttrs } from "./get-node-attrs";

export function getAttrs(
  schema: Schema,
  state: EditorState,
  type: string
): Record<string, any> {
  const nodeType = schema.maybeNodeType(type);
  if (nodeType) {
    return getNodeAttrs(state, nodeType);
  }
  const markType = schema.maybeMarkType(type);
  if (markType) {
    return getMarkAttrs(state, markType);
  }
  return {};
}
