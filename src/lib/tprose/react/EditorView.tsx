import { HTMLAttributes } from "react";
import type { FC, RefObject } from "../../teact/teact";
import React from "../../teact/teact";
import type { Plugin } from "../editor";

import { useEffect, useRef } from "../../teact/teact";
import { Editor, setContent } from "../editor";
import { JSONNode } from "../model";

interface EditorViewProps extends HTMLAttributes<HTMLDivElement> {
  ref?: RefObject<HTMLDivElement | null>;
  readOnly?: boolean;
  editorRef?: RefObject<Editor | null>;
  plugins: Plugin[];
  initialContent?: JSONNode;
  onUpdate?: (editor: Editor) => void;
}

export const EditorView: FC<EditorViewProps> = ({
  ref,
  readOnly = false,
  style,
  editorRef,
  plugins,
  initialContent,
  onUpdate,
  ...rest
}) => {
  let localRef = useRef<HTMLDivElement | null>(null);
  let localEditorRef = useRef<Editor | null>(null);

  if (ref) {
    localRef = ref;
  }

  if (editorRef) {
    localEditorRef = editorRef;
  }

  useEffect(() => {
    if (!localRef.current) {
      return;
    }
    const editor = new Editor(localRef.current, [...plugins, { onUpdate }]);
    localRef.current.style.whiteSpace = "pre-wrap";
    localEditorRef.current = editor;
    if (initialContent) {
      editor.apply(setContent(initialContent));
    }
    return () => {
      editor.destroy();
    };
  }, []);

  return <div {...rest} ref={localRef} contentEditable={!readOnly} />;
};
