import { Command, toggleNode } from "../../editor";

export function toggleBlockquote(): Command {
  return toggleNode("blockquote");
}
