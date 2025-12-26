"use dom";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import React, { useMemo } from "react";
import { View } from "react-native";

import {
  CodeHighlightNode,
  CodeNode,
} from "@lexical/code";
import { LinkNode } from "@lexical/link";
import {
  ListItemNode,
  ListNode,
} from "@lexical/list";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import {
  HeadingNode,
  QuoteNode,
} from "@lexical/rich-text";

export default function RichViewer({ value }: { value: string }) {
  const serialized = useMemo(() => {
    try {
      return JSON.parse(value);
    } catch (e) {
      console.warn("Invalid Lexical JSON:", e);
      return null;
    }
  }, [value]);

  if (!serialized) return null;

  return (
    <View style={{ minHeight: 10 }}>
      <LexicalComposer
        initialConfig={{
          namespace: "Viewer",
          editable: false, // read-only viewer
          theme: {},
          nodes: [
            HeadingNode,
            QuoteNode,
            ListNode,
            ListItemNode,
            LinkNode,
            CodeNode,
            CodeHighlightNode,
          ],
          onError(error) {
            console.error(error);
          },

          // 👇 NEW WAY: rehydrate saved lexical json
          editorState: (editor) => {
            const parsed = editor.parseEditorState(serialized);
            editor.setEditorState(parsed);
          },
        }}
      >
        <RichTextPlugin
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
          contentEditable={
            <ContentEditable
              maxLength={2}
              style={{
                color: "#333",
                fontSize: 14,
              }}
            />
          }
        />

        {/* History is safe even in read-only mode */}
        <HistoryPlugin />
      </LexicalComposer>
    </View>
  );
}