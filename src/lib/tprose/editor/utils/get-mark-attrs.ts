import { Attrs, Mark, MarkType } from "../../model";
import { EditorState } from "../../state";

export function getMarkAttrs(state: EditorState, type: MarkType): Attrs {
  const { from, to } = state.selection;
  const marks: Mark[] = [];

  state.doc.nodesBetween(from, to, (node) => {
    marks.push(...node.marks);
  });

  const mark = marks.find((markItem) => markItem.type.name === type.name);

  if (!mark) {
    return {};
  }

  return { ...mark.attrs };
}
