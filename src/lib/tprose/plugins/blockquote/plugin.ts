import { Command, Plugin } from "../../editor";
import { SchemaSpec } from "../../model";
import { toggleBlockquote } from "./commands";

export class BlockquotePlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      nodes: {
        blockquote: {
          block: true,
          parseDOM: [{ tag: "blockquote" }],
          toDOM: () => {
            const dom = document.createElement("blockquote");
            dom.style.display = "block";
            dom.style.width = "fit-content";
            dom.style.paddingRight = "1.5rem";
            dom.style.paddingBlock = "0.25rem";
            dom.style.marginBlock = "0.5rem";
            return dom;
          },
        },
      },
    };
  }

  keyMap(): Record<string, Command> {
    return {
      "Mod-Shift-B": toggleBlockquote(),
    };
  }
}
