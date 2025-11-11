"use dom";
import "./styles.css";

import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";

import { ListItemNode, ListNode } from "@lexical/list";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
import React, { useEffect, useRef, useState } from "react";
import ExampleTheme from "./example-theme";
import ToolbarPlugin from "./plugins/toolbar-plugins";

const placeholder = "Enter some rich text...";

const editorConfig = {
  namespace: "React.js Demo",
  nodes: [
    ListNode,
    ListItemNode,
    // You can add more custom nodes here
  ],
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // The editor theme
  theme: ExampleTheme,
  // theme: {},
};



// ✅ safer initialization plugin
function InitializeValuePlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (value && !initialized) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(value));
        root.append(paragraph);
      });
      setInitialized(true);
    }
  }, [editor, initialized]);

  return null;
}


function SyncValuePlugin({ value }: { value?: string }) {
  const [editor] = useLexicalComposerContext();
  const prevValueRef = useRef<string | undefined>('');

  useEffect(() => {
    if (value === undefined || value === prevValueRef.current) return;

    editor.update(() => {
      const root = $getRoot();
      const textContent = root.getTextContent();

      if (textContent !== value) {
        // Save current selection
        const selection = editor.getEditorState().read(() => {
          return editor.getEditorState().read(() => {
            return editor.getEditorState().toJSON(); // save state snapshot
          });
        });

        root.clear();
        const paragraph = $createParagraphNode();
        paragraph.append($createTextNode(value));
        root.append(paragraph);

        // Restore selection via editor.update (optional, approximate)
        // Lexical doesn’t expose direct selection API in TS; usually you just reset to the end:
        const nodes = root.getChildren();
        if (nodes.length > 0) {
          nodes[nodes.length - 1].selectEnd(); // move cursor to end
        }
      }
    });

    prevValueRef.current = value;
  }, [editor, value]);

  return null;
}


export default function RichEditor({
  setPlainText,
  setEditorState,
  editorBackgroundColor,
  onChange,
  value
}: {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  editorBackgroundColor?: string;
  onChange?: (text: string) => void;
  value?: string;
}) {

  const skipNextChange = useRef(false); // at top of RichEditor


  const [bgColor, setBgColor] = useState(editorBackgroundColor);
  const [isReady, setIsReady] = useState(false);

  const [editorContent, setEditorContent] = useState(value || "");
  const editorRef = useRef<any>(null); // store Lexical editor instance

  // 👇 delay onChange activation until after first mount
  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 0);
    return () => clearTimeout(timer);
  }, []);


  // ✅ Update local state if the prop changes
  useEffect(() => {
    if (editorBackgroundColor) {
      setBgColor(editorBackgroundColor);
    }
  }, [editorBackgroundColor]);

  // Sync value prop into editor when form resets
  useEffect(() => {
    if (value !== editorContent) {
      setEditorContent(value || "");
    }
  }, [value]);

  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        {/* <div style={{}}> */}
        {/* </div> */}
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner" style={{ backgroundColor: bgColor }}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  className="editor-input"
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className="editor-placeholder">{placeholder}</div>
                  }
                />
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
            {isReady && (
              <OnChangePlugin
                onChange={(editorState, editor, tags) => {
                  // if (skipNextChange.current) {
                  //   skipNextChange.current = false;
                  //   return; // ignore this change to prevent reverse overwrite
                  // }
                  if (skipNextChange.current) {
                    skipNextChange.current = false;
                    return; // ignore the next change to prevent reverse overwrite
                  }
                  editorState.read(() => {
                    const root = $getRoot();
                    const textContent = root.getTextContent();
                    setPlainText(textContent);
                    onChange?.(textContent); // notify React Hook Form
                    setEditorContent(textContent);
                  });
                  setEditorState(JSON.stringify(editorState.toJSON()));
                }}
                ignoreHistoryMergeTagChange
                ignoreSelectionChange
              />
            )}

            {/* <SetEditorValuePlugin value={value} /> */}
            <SyncValuePlugin value={value} skipNextChange={skipNextChange} />
            {/* <InitializeValuePlugin value={value} /> */}
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin /> {/* <-- add this line */}
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}