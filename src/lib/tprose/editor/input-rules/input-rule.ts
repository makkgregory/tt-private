import { EditorState } from '../../state';

export const ORIGIN_INPUT_RULE = 'inputRule';

export interface InputRule {
  readonly regex: RegExp;
  apply(
    state: EditorState,
    from: number,
    to: number,
    match: RegExpMatchArray,
  ): EditorState;
}
