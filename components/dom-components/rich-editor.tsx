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
import { $getRoot } from "lexical";
import React from "react";
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
export default function RichEditor({
  setPlainText,
  setEditorState,
  editorBackgroundColor
}: {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  editorBackgroundColor?: string;
}) {
  return (
    <>
      <LexicalComposer initialConfig={editorConfig}>
        {/* <div style={{}}> */}
        {/* </div> */}
        <div className="editor-container">
          <ToolbarPlugin />
          <div className="editor-inner" style={{backgroundColor: editorBackgroundColor}}>
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
            <OnChangePlugin
              onChange={(editorState, editor, tags) => {
                editorState.read(() => {
                  const root = $getRoot();
                  const textContent = root.getTextContent();
                  setPlainText(textContent);
                });
                setEditorState(JSON.stringify(editorState.toJSON()));
              }}
              ignoreHistoryMergeTagChange
              ignoreSelectionChange
            />
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