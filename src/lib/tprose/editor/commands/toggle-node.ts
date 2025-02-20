import { Attrs } from "../../model";
import { isNodeActive } from "../utils/is-node-active";
import { Command } from "./command";
import { lift } from "./lift";
import { wrapIn } from "./wrap-in";

export function toggleNode(type: string, attrs?: Attrs): Command {
  return ({ state, schema, ...rest }) => {
    const nodeType = schema.nodeType(type);
    return isNodeActive(state, nodeType, attrs)
      ? lift()({ state, schema, ...rest })
      : wrapIn(type, attrs)({ state, schema, ...rest });
  };
}
