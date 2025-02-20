import Icon from "../../../../components/common/icons/Icon";
import "../../../../components/middle/composer/TextFormatter.scss";
import Button from "../../../../components/ui/Button";
import useFlag from "../../../../hooks/useFlag";
import useOldLang from "../../../../hooks/useOldLang";
import buildClassName from "../../../../util/buildClassName";
import React, {
  FC,
  memo,
  useEffect,
  useRef,
  useState,
} from "../../../teact/teact";
import { Editor } from "../../editor";
import { toggleBlockquote } from "../blockquote";
import { toggleBold } from "../bold";
import { toggleCode } from "../code";
import { toggleItalic } from "../italic";
import { toggleLink } from "../link";
import { toggleSpoiler } from "../spoiler";
import { toggleStrike } from "../strike";
import { toggleUnderline } from "../underline";

export type BubbleMenuViewMode = "default" | "link";

interface BubbleMenuProps {
  editor: Editor;
  isOpen: boolean;
  viewMode: BubbleMenuViewMode;
  onViewModeChange: (viewMode: BubbleMenuViewMode) => void;
}

interface ISelectedTextFormats {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  monospace?: boolean;
  spoiler?: boolean;
  quote?: boolean;
  link?: boolean;
}

const BubbleMenu: FC<BubbleMenuProps> = ({ editor }) => {
  const lang = useOldLang();
  // eslint-disable-next-line no-null/no-null
  const linkUrlInputRef = useRef<HTMLInputElement>(null);
  const [isLinkControlOpen, openLinkControl, closeLinkControl] = useFlag();
  const [linkUrl, setLinkUrl] = useState("");
  const [inputClassName, setInputClassName] = useState<string | undefined>();

  const selectedTextFormats: ISelectedTextFormats = {
    bold: editor.isActive("bold"),
    italic: editor.isActive("italic"),
    underline: editor.isActive("underline"),
    strikethrough: editor.isActive("strike"),
    monospace: editor.isActive("code"),
    spoiler: editor.isActive("spoiler"),
    quote: editor.isActive("quote"),
    link: editor.isActive("link"),
  };

  const className = buildClassName(
    "TextFormatter",
    isLinkControlOpen && "link-control-shown"
  );

  const linkUrlConfirmClassName = buildClassName(
    "TextFormatter-link-url-confirm",
    Boolean(linkUrl.length) && "shown"
  );

  useEffect(() => {
    const { href } = editor.getAttrs("link");
    setLinkUrl(href ? String(href) : "");
    closeLinkControl();
  }, [editor.state.selection]);

  function getFormatButtonClassName(key: keyof ISelectedTextFormats) {
    if (selectedTextFormats[key]) {
      return "active";
    }

    if (key === "monospace" || key === "strikethrough") {
      if (
        Object.keys(selectedTextFormats).some(
          (fKey) =>
            fKey !== key &&
            Boolean(selectedTextFormats[fKey as keyof ISelectedTextFormats])
        )
      ) {
        return "disabled";
      }
    } else if (
      selectedTextFormats.monospace ||
      selectedTextFormats.strikethrough
    ) {
      return "disabled";
    }

    return undefined;
  }

  function updateInputStyles() {
    const input = linkUrlInputRef.current;
    if (!input) {
      return;
    }

    const { offsetWidth, scrollWidth, scrollLeft } = input;
    if (scrollWidth <= offsetWidth) {
      setInputClassName(undefined);
      return;
    }

    let className = "";
    if (scrollLeft < scrollWidth - offsetWidth) {
      className = "mask-right";
    }
    if (scrollLeft > 0) {
      className += " mask-left";
    }

    setInputClassName(className);
  }

  function handleLinkUrlChange(e: React.ChangeEvent<HTMLInputElement>) {
    setLinkUrl(e.target.value);
    updateInputStyles();
  }

  useEffect(() => {
    if (isLinkControlOpen) {
      linkUrlInputRef.current?.focus();
    }
  }, [isLinkControlOpen]);

  return (
    <div className={className}>
      <div className="TextFormatter-buttons">
        <Button
          color="translucent"
          ariaLabel="Spoiler text"
          className={getFormatButtonClassName("spoiler")}
          onClick={() => editor.apply(toggleSpoiler())}
        >
          <Icon name="eye-closed" />
        </Button>
        <div className="TextFormatter-divider" />
        <Button
          color="translucent"
          ariaLabel="Bold text"
          className={getFormatButtonClassName("bold")}
          onClick={() => editor.apply(toggleBold())}
        >
          <Icon name="bold" />
        </Button>
        <Button
          color="translucent"
          ariaLabel="Italic text"
          className={getFormatButtonClassName("italic")}
          onClick={() => editor.apply(toggleItalic())}
        >
          <Icon name="italic" />
        </Button>
        <Button
          color="translucent"
          ariaLabel="Underlined text"
          className={getFormatButtonClassName("underline")}
          onClick={() => editor.apply(toggleUnderline())}
        >
          <Icon name="underlined" />
        </Button>
        <Button
          color="translucent"
          ariaLabel="Strikethrough text"
          className={getFormatButtonClassName("strikethrough")}
          onClick={() => editor.apply(toggleStrike())}
        >
          <Icon name="strikethrough" />
        </Button>
        <Button
          color="translucent"
          ariaLabel="Monospace text"
          className={getFormatButtonClassName("monospace")}
          onClick={() => editor.apply(toggleCode())}
        >
          <Icon name="monospace" />
        </Button>
        <Button
          color="translucent"
          ariaLabel="Quote text"
          className={getFormatButtonClassName("quote")}
          onClick={() => editor.apply(toggleBlockquote())}
        >
          <Icon name="quote-text" />
        </Button>
        <div className="TextFormatter-divider" />
        <Button
          color="translucent"
          ariaLabel={lang("TextFormat.AddLinkTitle")}
          onClick={openLinkControl}
          className={getFormatButtonClassName("link")}
        >
          <Icon name="link" />
        </Button>
      </div>

      <div className="TextFormatter-link-control">
        <div className="TextFormatter-buttons">
          <Button
            color="translucent"
            ariaLabel={lang("Cancel")}
            onClick={closeLinkControl}
          >
            <Icon name="arrow-left" />
          </Button>
          <div className="TextFormatter-divider" />

          <div
            className={buildClassName(
              "TextFormatter-link-url-input-wrapper",
              inputClassName
            )}
          >
            <input
              ref={linkUrlInputRef}
              className="TextFormatter-link-url-input"
              type="text"
              value={linkUrl}
              placeholder="Enter URL..."
              autoComplete="off"
              inputMode="url"
              dir="auto"
              onChange={handleLinkUrlChange}
              onScroll={updateInputStyles}
            />
          </div>

          <div className={linkUrlConfirmClassName}>
            <div className="TextFormatter-divider" />
            <Button
              color="translucent"
              ariaLabel={lang("Save")}
              className="color-primary"
              onClick={() => {
                editor.apply(toggleLink(linkUrl));
                editor.dom.focus();
                setLinkUrl("");
                closeLinkControl();
              }}
            >
              <Icon name="check" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(BubbleMenu);
