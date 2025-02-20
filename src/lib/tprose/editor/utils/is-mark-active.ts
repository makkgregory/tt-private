import { Attrs, MarkType, Node } from '../../model';
import { EditorState } from '../../state';

interface MarkRange {
  node: Node;
  start: number;
  end: number;
}

export const isMarkActive = (
  { selection, doc }: EditorState,
  type: MarkType,
  attrs?: Attrs,
) => {
  if (selection.empty) {
    return selection.$from.marks.has(type, attrs);
  }
  const markRanges: MarkRange[] = [];

  selection.ranges.forEach(({ from, to }) => {
    doc.nodesBetween(from, to, (node, pos) => {
      if (!node.type.text && node.marks.isEmpty) {
        return;
      }
      const start = Math.max(from, pos);
      const end = Math.min(to, pos + node.size);
      markRanges.push({ node, start, end });
    });
  });

  const selectionRange = markRanges.reduce(
    (acc, { start, end }) => acc + end - start,
    0,
  );
  const matchedRange = markRanges
    .filter(({ node }) => node.marks.has(type, attrs))
    .reduce((acc, { start, end }) => acc + end - start, 0);

  if (!matchedRange) {
    return false;
  }

  return selectionRange === matchedRange;
};
