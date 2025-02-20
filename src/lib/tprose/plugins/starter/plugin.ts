import { Plugin } from '../../editor';
import { BankCardPlugin } from '../bank-card';
import { BlockquotePlugin } from '../blockquote';
import { BoldPlugin } from '../bold';
import { BotCommandPlugin } from '../bot-command';
import { BubbleMenuPlugin } from '../bubble-menu';
import { CodePlugin } from '../code';
import { CustomEmojiPlugin } from '../custom-emoji';
import { DocumentPlugin } from '../document';
import { EmailPlugin } from '../email';
import { HardBreakPlugin } from '../hard-break';
import { HashTagPlugin } from '../hash-tag';
import { HistoryPlugin } from '../history';
import { ItalicPlugin } from '../italic';
import { LinkPlugin } from '../link';
import { MentionPlugin } from '../mention';
import { PhonePlugin } from '../phone';
import { SpoilerPlugin } from '../spoiler';
import { StrikePlugin } from '../strike';
import { TextPlugin } from '../text';
import { UnderlinePlugin } from '../underline';

export class StarterPlugin implements Plugin {
  plugins(): Plugin[] {
    return [
      new BankCardPlugin(),
      new BlockquotePlugin(),
      new BoldPlugin(),
      new BotCommandPlugin(),
      new BubbleMenuPlugin(),
      new CodePlugin(),
      new DocumentPlugin(),
      new EmailPlugin(),
      new HardBreakPlugin(),
      new HashTagPlugin(),
      new HistoryPlugin(),
      new ItalicPlugin(),
      new LinkPlugin(),
      new MentionPlugin(),
      new PhonePlugin(),
      new SpoilerPlugin(),
      new StrikePlugin(),
      new TextPlugin(),
      new UnderlinePlugin(),
      new CustomEmojiPlugin(),
    ];
  }
}
