import { Command, Editor, Plugin } from "../../editor";
import { SchemaSpec } from "../../model";
import { setHardBreak } from "./commands";

export class HardBreakPlugin implements Plugin {
  schema(): SchemaSpec {
    return {
      nodes: {
        hardBreak: {
          leaf: true,
          inline: true,
          marks: [],
          parseDOM: [{ tag: "br:not(.tprose-trailing-hack)" }],
          leafText: () => "\n",
          toDOM: () => {
            return document.createElement("br");
          },
        },
      },
    };
  }

  onInput(_editor: Editor, event: InputEvent): Command | false {
    switch (event.inputType) {
      case "insertLineBreak":
        return setHardBreak();
      default:
        return false;
    }
  }

  keyMap(): Record<string, Command> {
    return {
      "Mod-Enter": setHardBreak(),
      "Shift-Enter": setHardBreak(),
    };
  }
}
