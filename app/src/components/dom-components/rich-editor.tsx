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
import React, { useEffect, useState } from "react";
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

// 🧩 This plugin sets the editor content from the `value` prop
// function SetEditorValuePlugin({ value }: { value?: string }) {
//   const [editor] = useLexicalComposerContext();

//   useEffect(() => {
//     if (value) {
//       editor.update(() => {
//         const root = $getRoot();
//         root.clear(); // clear previous content
//         const paragraph = $createParagraphNode();
//         paragraph.append($createTextNode(value));
//         root.append(paragraph);
//       });
//     }
//   }, [editor, value]);

//   return null;
// }

// function SetEditorValuePlugin({ value }: { value?: string }) {
//   const [editor] = useLexicalComposerContext();
//   const [initialized, setInitialized] = useState(false);

//   useEffect(() => {
//     if (value && !initialized) {
//       editor.update(() => {
//         const root = $getRoot();
//         root.clear();
//         const paragraph = $createParagraphNode();
//         paragraph.append($createTextNode(value));
//         root.append(paragraph);
//       });
//       setInitialized(true);
//     }
//   }, [editor, value, initialized]);

//   return null;
// }

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


  const [bgColor, setBgColor] = useState(editorBackgroundColor);
  const [isReady, setIsReady] = useState(false);

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
                  editorState.read(() => {
                    const root = $getRoot();
                    const textContent = root.getTextContent();
                    setPlainText(textContent);
                    onChange?.(textContent); // notify React Hook Form
                  });
                  setEditorState(JSON.stringify(editorState.toJSON()));
                }}
                ignoreHistoryMergeTagChange
                ignoreSelectionChange
              />
            )}

            {/* <SetEditorValuePlugin value={value} /> */}
            <InitializeValuePlugin value={value} />
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