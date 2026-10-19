"use client";

import { use, useReducer, useRef, type ReactNode } from "react";
import { browser } from "react-dom";
import { BoardDispatchContext, BoardStateContext } from "@/hooks/board/BoardContext";
import { boardReducer, type BoardAction, type BoardStore } from "@/utils/board/boardReducer";
import { loadBoard, saveBoard } from "@/utils/board/storage";
import type { BoardState } from "@/utils/board/types";

type BoardProviderProps = {
  children: ReactNode;
  /** Seeds the board instead of reading localStorage (tests, stories). */
  initialBoard?: BoardState;
};

function init(initialBoard: BoardState | undefined): BoardStore {
  return { board: initialBoard ?? loadBoard(), celebratingItemId: null };
}

/**
 * Owns the board state and persists it to localStorage.
 *
 * Browser-only: during prerendering `browser()` suspends to the nearest
 * <Suspense>, whose fallback becomes the initial HTML.
 *
 * Persistence happens inside `dispatch`, which only runs from event handlers,
 * so no effect is needed. `latest` mirrors the reducer state so several
 * dispatches before a re-render (e.g. rapid drag hovers) each save the right board.
 */
export default function BoardProvider({ children, initialBoard }: BoardProviderProps) {
  use(browser("The board is stored in localStorage."));
  const [store, baseDispatch] = useReducer(boardReducer, initialBoard, init);
  const latest = useRef(store);

  function dispatch(action: BoardAction) {
    const next = boardReducer(latest.current, action);
    if (next.board !== latest.current.board) saveBoard(next.board);
    latest.current = next;
    baseDispatch(action);
  }

  return (
    <BoardStateContext value={store}>
      <BoardDispatchContext value={dispatch}>{children}</BoardDispatchContext>
    </BoardStateContext>
  );
}
