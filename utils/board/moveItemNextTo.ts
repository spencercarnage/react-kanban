import { findColumn } from "./findColumn";
import { moveItem } from "./moveItem";
import type { BoardState } from "./types";

export type DropPosition = "before" | "after";

/** Moves an item directly before or after another item, in whichever column it lives. */
export function moveItemNextTo(
  board: BoardState,
  itemId: string,
  targetId: string,
  position: DropPosition,
): BoardState {
  const toColumn = findColumn(board, targetId);
  if (!toColumn || itemId === targetId) return board;

  // Index of the target once the moving item has been taken out of the list.
  const targetIndex = board.columns[toColumn].filter((id) => id !== itemId).indexOf(targetId);

  return moveItem(board, itemId, toColumn, position === "after" ? targetIndex + 1 : targetIndex);
}
