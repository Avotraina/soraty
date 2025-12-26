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
import { $getRoot, SerializedEditorState } from "lexical";
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
// function InitializeValuePlugin({ value }: { value?: string }) {
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
//   }, [editor, initialized]);

//   return null;
// }


// function SyncValuePlugin({ value, skipNextChange }: { value?: string; skipNextChange?: React.MutableRefObject<boolean> }) {
//   const [editor] = useLexicalComposerContext();
//   const prevValueRef = useRef<string | undefined>(undefined);

//   useEffect(() => {
//     if (value === undefined || value === prevValueRef.current) return;

//     // Mark that the next OnChange coming from this programmatic update
//     // should be ignored by the editor OnChange handler.
//     if (skipNextChange) {
//       skipNextChange.current = true;
//     }

//     // Helper: if the incoming `value` looks like Lexical JSON, try to
//     // extract readable plain text so the simple insertion below shows
//     // the meaningful content instead of raw JSON.
//     const extractText = (raw?: string) => {
//       if (!raw) return "";
//       // quick detection for JSON
//       const trimmed = raw.trim();
//       if (!trimmed.startsWith("{") && !trimmed.startsWith("[")) return raw;
//       try {
//         const parsed = JSON.parse(raw);
//         // Lexical editor state shape: { root: { children: [ ... ] } }
//         const parts: string[] = [];
//         const walk = (node: any) => {
//           if (!node) return;
//           if (Array.isArray(node)) return node.forEach(walk);
//           if (typeof node === "string") return parts.push(node);
//           if (node.text) return parts.push(node.text);
//           if (node.children) return node.children.forEach(walk);
//         };
//         if (parsed.root) {
//           walk(parsed.root.children);
//           return parts.join("\n");
//         }
//         return raw;
//       } catch (e) {
//         return raw;
//       }
//     };

//     const textToInsert = extractText(value);

//     console.debug("[RichEditor] SyncValuePlugin applying programmatic update", { value, textToInsert });

//     editor.update(() => {
//       const root = $getRoot();
//       const currentText = root.getTextContent();

//       if (currentText !== textToInsert) {
//         root.clear();
//         const paragraph = $createParagraphNode();
//         paragraph.append($createTextNode(textToInsert || ""));
//         root.append(paragraph);

//         // Move cursor to end of document
//         const nodes = root.getChildren();
//         if (nodes.length > 0) {
//           try {
//             nodes[nodes.length - 1].selectEnd();
//           } catch (e) {
//             // ignore selection restore errors
//           }
//         }
//       }
//     });

//     // Clear the skip flag shortly after the programmatic update so that
//     // subsequent user edits are handled normally.
//     if (skipNextChange) {
//       // use microtask to avoid racing with the OnChange that fires synchronously
//       setTimeout(() => {
//         skipNextChange.current = false;
//       }, 0);
//     }

//     prevValueRef.current = value;
//   }, [editor, value, skipNextChange]);

//   return null;
// }


function SyncValuePlugin({
  value,
  skipNextChange,
}: {
  value?: string;
  skipNextChange?: React.RefObject<boolean>;
}) {
  const [editor] = useLexicalComposerContext();
  const prevValueRef = useRef<string | undefined>(undefined);


  useEffect(() => {
    if (!value || value === prevValueRef.current) return;

    let parsedState = JSON.stringify({
      root: {
        type: "root",
        format: "",
        indent: 0,
        version: 1,
        direction: "ltr",
        children: [],
      },
    } satisfies SerializedEditorState);
    try {
      parsedState = value ? JSON.parse(value) : null;
    } catch {
      return; // not valid Lexical JSON
    }

    skipNextChange && (skipNextChange.current = true);

    editor.update(() => {
      const editorState = parsedState ? editor.parseEditorState(parsedState) : null;
      if (editorState)
        editor.setEditorState(editorState);
    });

    prevValueRef.current = value;

    if (skipNextChange) {
      setTimeout(() => {
        skipNextChange.current = false;
      }, 0);
    }
  }, [editor, value, skipNextChange]);

  return null;
}

// function SyncValuePlugin({
//   value,
//   skipNextChange,
// }: {
//   value?: string;
//   skipNextChange?: React.MutableRefObject<boolean>;
// }) {
//   const [editor] = useLexicalComposerContext();
//   const prevValueRef = useRef<string | undefined>(undefined);

//   useEffect(() => {
//     if (!value || value === prevValueRef.current) return;

//     let parsed;
//     try {
//       parsed = JSON.parse(value);
//     } catch {
//       return; // not JSON
//     }

//     // ❌ Invalid Lexical state (missing root)
//     if (!parsed?.root?.children) {
//       console.debug("[SyncValuePlugin] invalid or empty editor state, resetting");
//       skipNextChange && (skipNextChange.current = true);

//       editor.update(() => {
//         const emptyState = editor.parseEditorState(
//           JSON.stringify({
//             root: {
//               type: "root",
//               format: "",
//               indent: 0,
//               version: 1,
//               direction: "ltr",
//               children: [],
//             },
//           })
//         );
//         editor.setEditorState(emptyState);
//       });

//       prevValueRef.current = value;
//       return;
//     }

//     skipNextChange && (skipNextChange.current = true);

//     editor.update(() => {
//       const editorState = editor.parseEditorState(parsed);
//       editor.setEditorState(editorState);
//     });

//     prevValueRef.current = value;

//     if (skipNextChange) {
//       setTimeout(() => {
//         skipNextChange.current = false;
//       }, 0);
//     }
//   }, [editor, value, skipNextChange]);

//   return null;
// }



export default function RichEditor({
  setPlainText,
  setEditorState,
  editorBackgroundColor,
  toolbarStyle,
  onChange,
  value,
  setJson,
}: {
  setPlainText: React.Dispatch<React.SetStateAction<string>>;
  setEditorState: React.Dispatch<React.SetStateAction<string | null>>;
  editorBackgroundColor?: string;
  toolbarStyle?: React.CSSProperties;
  onChange?: (text: string) => void;
  value?: string;
  setJson: React.Dispatch<React.SetStateAction<any>>
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
    // Always update bgColor when prop changes (allow falsy values)
    console.debug("[RichEditor] editorBackgroundColor change ->", editorBackgroundColor);
    setBgColor(editorBackgroundColor ?? undefined);
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
          <ToolbarPlugin style={toolbarStyle} />
          <div className="editor-inner" style={{ backgroundColor: editorBackgroundColor }}>
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  allowFullScreen
                  className="editor-input"
                  aria-placeholder={placeholder}
                  placeholder={
                    <div className="editor-placeholder">{placeholder}</div>
                  }
                  style={{ backgroundColor: bgColor }}
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
                    console.debug("[RichEditor] OnChangePlugin ignoring change due to skipNextChange flag");
                    skipNextChange.current = false;
                    return; // ignore the next change to prevent reverse overwrite
                  }
                  console.debug("[RichEditor] OnChangePlugin handling user change", { tags });
                  editorState.read(() => {
                    const root = $getRoot();
                    const textContent = root.getTextContent();
                    const jsonState = editorState.toJSON(); // for saving to DB
                    setPlainText(textContent);
                    onChange?.(textContent); // notify React Hook Form
                    setEditorState(JSON.stringify(jsonState));
                    setJson(jsonState)

                  });
                  const jsonState = editorState.toJSON(); // for saving to DB
                  setEditorState(JSON.stringify(jsonState));

                  // setEditorState(JSON.stringify(editorState.toJSON()));
                }}
                ignoreHistoryMergeTagChange
                ignoreSelectionChange
              />
            )}

            {/* <SetEditorValuePlugin value={value} /> */}
            <SyncValuePlugin value={value ?? undefined} skipNextChange={skipNextChange} />
            {/* <InitializeValuePlugin value={value} /> */}
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            {/* <TreeViewPlugin /> */}
          </div>
        </div>
      </LexicalComposer>
    </>
  );
}