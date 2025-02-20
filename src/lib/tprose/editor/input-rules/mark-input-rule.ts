import { Attrs, MarkType } from '../../model';
import { EditorState } from '../../state';
import { InputRule, ORIGIN_INPUT_RULE } from './input-rule';

export class MarkInputRule implements InputRule {
  constructor(
    readonly regex: RegExp,
    readonly type: MarkType,
    readonly getAttrs?: (match: string) => Attrs,
  ) {}

  apply(
    state: EditorState,
    from: number,
    to: number,
    match: RegExpMatchArray,
  ): EditorState {
    const captureGroup = match[match.length - 1];
    const fullMatch = match[0];
    let tx = state.tx(ORIGIN_INPUT_RULE);
    if (captureGroup) {
      const startSpaces = fullMatch.search(/\S/);
      const textStart = from + fullMatch.indexOf(captureGroup);
      const textEnd = textStart + captureGroup.length;
      if (textEnd < to) {
        tx = tx.delete(textEnd, to);
      }
      if (textStart > from) {
        tx = tx.delete(from + startSpaces, textStart);
      }
      const markEnd = from + startSpaces + captureGroup.length;
      tx = tx.addMark(
        from + startSpaces,
        markEnd,
        this.type.create(this.getAttrs?.(captureGroup)),
      );
      return tx.state;
    }
    return state;
  }
}
