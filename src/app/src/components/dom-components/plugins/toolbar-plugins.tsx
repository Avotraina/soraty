/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import {
  $isListItemNode,
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND
} from "@lexical/list";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  UNDO_COMMAND,
} from "lexical";
import { useCallback, useEffect, useRef, useState } from "react";
import "../styles.css";

const LowPriority = 1;

function Divider() {
  return <div className="divider" />;
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);

  const [blockType, setBlockType] = useState<"bullet" | "number" | "check" | "paragraph">("paragraph");

  // const toggleBulletList = () => {
  //   editor.update(() => {
  //     const selection = $getSelection();
  //     if (!$isRangeSelection(selection)) return;

  //     const anchorNode = selection.anchor.getNode();
  //     const parent = anchorNode.getParent();

  //     // If we're already inside a bullet list, remove only that item
  //     if (parent && $isListNode(parent) && parent.getListType() === "bullet") {
  //       const listItem = parent;
  //       const paragraph = $createParagraphNode();
  //       listItem.replace(paragraph); // replaces only the selected list line
  //     } else {
  //       editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  //     }
  //   });
  // };

  function toggleList(type: "bullet" | "number") {
  editor.update(() => {
    const selection = $getSelection();
    if (!$isRangeSelection(selection)) return;

    const anchorNode = selection.anchor.getNode();

    // Find the nearest ListItemNode
    let listItemNode = anchorNode;
    while (listItemNode && !$isListItemNode(listItemNode)) {
      const parent = listItemNode.getParent();
      if (!parent) break;
      listItemNode = parent;
    }

      if (listItemNode) {
      const parentList = listItemNode.getParent();
      if (parentList && $isListNode(parentList) && parentList.getListType() === type) {
        // ✅ Convert ONLY this item to a paragraph
        const paragraph = $createParagraphNode();
        if ($isListItemNode(listItemNode)) {
          paragraph.append(...listItemNode.getChildren());
        }
        listItemNode.replace(paragraph);
        return;
      }
    }

    // If not inside a list of that type, insert it
    editor.dispatchCommand(
      type === "bullet"
        ? INSERT_UNORDERED_LIST_COMMAND
        : INSERT_ORDERED_LIST_COMMAND,
      undefined
    );
  });
}

  const $updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {

      const anchorNode = selection.anchor.getNode();
      let element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

      if ($isListNode(element)) {
        const listType = element.getListType();
        setBlockType(listType); // "bullet" or "number"
      } else {
        setBlockType("paragraph");
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, []);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          $updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, _newEditor) => {
          $updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, $updateToolbar]);

  return (
    <div className="toolbar" ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND, undefined);
        }}
        className="toolbar-item spaced"
        aria-label="Undo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-counterclockwise format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 1 1-4.546 2.914.5.5 0 0 0-.908-.417A6 6 0 1 0 8 2v1z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 0-.41-.192L5.23 2.308a.25.25 0 0 0 0 .384l2.36 1.966A.25.25 0 0 0 8 4.466z" />
        </svg>
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND, undefined);
        }}
        className="toolbar-item"
        aria-label="Redo"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-arrow-clockwise format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M8 3a5 5 0 1 0 4.546 2.914.5.5 0 0 1 .908-.417A6 6 0 1 1 8 2v1z"
          />
          <path d="M8 4.466V.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384L8.41 4.658A.25.25 0 0 1 8 4.466z" />
        </svg>
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={"toolbar-item spaced " + (isBold ? "active" : "")}
        aria-label="Format Bold"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-type-bold format"
          viewBox="0 0 16 16"
        >
          <path d="M8.21 13c2.106 0 3.412-1.087 3.412-2.823 0-1.306-.984-2.283-2.324-2.386v-.055a2.176 2.176 0 0 0 1.852-2.14c0-1.51-1.162-2.46-3.014-2.46H3.843V13H8.21zM5.908 4.674h1.696c.963 0 1.517.451 1.517 1.244 0 .834-.629 1.32-1.73 1.32H5.908V4.673zm0 6.788V8.598h1.73c1.217 0 1.88.492 1.88 1.415 0 .943-.643 1.449-1.832 1.449H5.907z" />
        </svg>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        className={"toolbar-item spaced " + (isItalic ? "active" : "")}
        aria-label="Format Italics"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-type-italic format"
          viewBox="0 0 16 16"
        >
          <path d="M7.991 11.674 9.53 4.455c.123-.595.246-.71 1.347-.807l.11-.52H7.211l-.11.52c1.06.096 1.128.212 1.005.807L6.57 11.674c-.123.595-.246.71-1.346.806l-.11.52h3.774l.11-.52c-1.06-.095-1.129-.211-1.006-.806z" />
        </svg>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        className={"toolbar-item spaced " + (isUnderline ? "active" : "")}
        aria-label="Format Underline"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-type-underline format"
          viewBox="0 0 16 16"
        >
          <path d="M5.313 3.136h-1.23V9.54c0 2.105 1.47 3.623 3.917 3.623s3.917-1.518 3.917-3.623V3.136h-1.23v6.323c0 1.49-.978 2.57-2.687 2.57-1.709 0-2.687-1.08-2.687-2.57V3.136zM12.5 15h-9v-1h9v1z" />
        </svg>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        className={"toolbar-item spaced " + (isStrikethrough ? "active" : "")}
        aria-label="Format Strikethrough"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-type-strikethrough format"
          viewBox="0 0 16 16"
        >
          <path d="M6.333 5.686c0 .31.083.581.27.814H5.166a2.776 2.776 0 0 1-.099-.76c0-1.627 1.436-2.768 3.48-2.768 1.969 0 3.39 1.175 3.445 2.85h-1.23c-.11-1.08-.964-1.743-2.25-1.743-1.23 0-2.18.602-2.18 1.607zm2.194 7.478c-2.153 0-3.589-1.107-3.705-2.81h1.23c.144 1.06 1.129 1.703 2.544 1.703 1.34 0 2.31-.705 2.31-1.675 0-.827-.547-1.374-1.914-1.675L8.046 8.5H1v-1h14v1h-3.504c.468.437.675.994.675 1.697 0 1.826-1.436 2.967-3.644 2.967z" />
        </svg>
      </button>
      <Divider />
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
        }}
        className="toolbar-item spaced"
        aria-label="Left Align"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-text-left format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
        }}
        className="toolbar-item spaced"
        aria-label="Center Align"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-text-center format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M4 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
        }}
        className="toolbar-item spaced"
        aria-label="Right Align"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-text-right format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M6 12.5a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm4-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5zm-4-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
        }}
        className="toolbar-item"
        aria-label="Justify Align"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-justify format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
          />
        </svg>
      </button>
      {/* Bulleted List */}
      <button
        // onClick={() => {
        //   if (blockType === "bullet") {
        //     editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
        //   } else {
        //     editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
        //   }
        // }}
        onClick={() => toggleList("bullet")}
        className={`toolbar-item spaced ${blockType === "bullet" ? "active" : ""}`}
        aria-label="Bulleted List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-list-ul format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M5 11.5a.5.5 0 0 1 .5-.5H15a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5H15a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 5.5 3H15a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5zM2 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zm0 4a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z"
          />
        </svg>
      </button>
      {/* Numbered List */}
      <button
        // onClick={() => {
        //   editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
        // }}
        onClick={() => toggleList("number")}
        className="toolbar-item spaced"
        aria-label="Numbered List"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-list-ol format"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M5 11.5a.5.5 0 0 1 .5-.5H15a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5zm0-4a.5.5 0 0 1 .5-.5H15a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5zm0-4A.5.5 0 0 1 5.5 3H15a.5.5 0 0 1 0 1H5.5a.5.5 0 0 1-.5-.5zM2.713 2.22c.186.186.287.442.287.78h-.574c0-.141-.04-.248-.107-.315a.36.36 0 0 0-.257-.1c-.143 0-.24.05-.293.142a.46.46 0 0 0-.066.236c0 .11.035.21.105.303.07.091.17.17.297.238.127.067.278.126.45.18.173.052.34.12.505.2.164.082.308.19.427.322.12.132.214.295.277.492.063.197.095.428.095.696 0 .33-.06.626-.179.89a1.42 1.42 0 0 1-.504.601c-.22.147-.49.22-.814.22-.358 0-.66-.094-.908-.28a1.23 1.23 0 0 1-.442-.739l.563-.14c.02.12.067.235.14.342.075.107.168.19.278.25a.83.83 0 0 0 .425.104c.201 0 .356-.06.467-.179a.74.74 0 0 0 .163-.475c0-.18-.036-.328-.109-.445a.875.875 0 0 0-.288-.273 3.12 3.12 0 0 0-.485-.217 4.95 4.95 0 0 1-.474-.212 1.53 1.53 0 0 1-.38-.272 1.3 1.3 0 0 1-.259-.392A1.42 1.42 0 0 1 1.5 2.6c0-.33.106-.617.318-.858.212-.24.503-.36.871-.36.345 0 .623.093.832.28zM1.723 9.208v-.485h.5v2.277h-.5v-.485h-.55v-.524h.55V9.208h-.55V8.683h1.1v.525h-.55zm-.223 3.063h.746v-.52H1v-.522h.746v-.493h-.746v-.522h1.37v2.556H1.5z"
          />
        </svg>
      </button>
    </div>
  );
}