import { Schema } from "../../model";
import { EditorState } from "../../state";

export interface CommandOptions {
  readonly schema: Schema;
  readonly state: EditorState;
}

export type Command = (options: CommandOptions) => EditorState;
