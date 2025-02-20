import { Attrs, Node, NodeType } from "../../model";
import { EditorState } from "../../state";

export function getNodeAttrs(state: EditorState, type: NodeType): Attrs {
  const { from, to } = state.selection;
  const nodes: Node[] = [];

  state.doc.nodesBetween(from, to, (node) => {
    nodes.push(node);
  });

  const node = nodes.reverse().find((curr) => curr.type.name === type.name);

  if (!node) {
    return {};
  }

  return { ...node.attrs };
}
