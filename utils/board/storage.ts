import { COLUMN_IDS, type BoardState } from "./types";

const STORAGE_KEY = "react-kanban:board";

export const EMPTY_BOARD: BoardState = {
  items: {},
  columns: { todo: [], doing: [], done: [] },
};

function isBoardState(value: unknown): value is BoardState {
  if (typeof value !== "object" || value === null) return false;
  const { items, columns } = value as Partial<BoardState>;
  return (
    typeof items === "object" &&
    items !== null &&
    typeof columns === "object" &&
    columns !== null &&
    COLUMN_IDS.every((id) => Array.isArray(columns[id]))
  );
}

/** Reads the saved board. Falls back to an empty board if storage is missing or corrupt. */
export function loadBoard(): BoardState {
  try {
    const saved: unknown = JSON.parse(window.localStorage.getItem(STORAGE_KEY) ?? "null");
    return isBoardState(saved) ? saved : EMPTY_BOARD;
  } catch {
    return EMPTY_BOARD;
  }
}

export function saveBoard(board: BoardState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(board));
  } catch {
    // Storage can be full or blocked (private mode); the board still works in memory.
  }
}
