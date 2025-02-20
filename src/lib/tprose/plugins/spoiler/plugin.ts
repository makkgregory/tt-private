import { Command, Plugin } from "../../editor";
import { SchemaSpec } from "../../model";
import { toggleSpoiler } from "./commands";

export class SpoilerPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      marks: {
        spoiler: {
          parseDOM: [{ tag: 'span[data-entity-type="MessageEntitySpoiler"]' }],
          toDOM: () => {
            const dom = document.createElement("span");
            dom.classList.add("spoiler");
            dom.dataset.entityType = "MessageEntitySpoiler";
            return dom;
          },
        },
      },
    };
  }

  keyMap(): Record<string, Command> {
    return {
      "Mod-P": toggleSpoiler(),
    };
  }
}
