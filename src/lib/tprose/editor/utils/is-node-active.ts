import { compareDeep } from '../../lib/compare-deep';
import { Attrs, Node, NodeType } from '../../model';
import { EditorState } from '../../state';

interface NodeRange {
  node: Node;
  start: number;
  end: number;
}

export const isNodeActive = (
  { selection, doc }: EditorState,
  type: NodeType,
  attrs: Attrs = {},
) => {
  const nodeRanges: NodeRange[] = [];

  selection.ranges.forEach(({ from, to }) => {
    doc.nodesBetween(from, to, (node, pos) => {
      if (node.type.text) {
        return;
      }
      const start = Math.max(from, pos);
      const end = Math.min(to, pos + node.size);
      nodeRanges.push({ node, start, end });
    });
  });

  const selectionRange = selection.to - selection.from;

  const matchedRanges = nodeRanges.filter(
    ({ node }) => node.type === type && compareDeep(node.attrs, attrs),
  );

  if (selection.empty) {
    return matchedRanges.length > 0;
  }

  const matchedRange = matchedRanges.reduce(
    (acc, { start, end }) => acc + end - start,
    0,
  );

  return matchedRange >= selectionRange;
};
