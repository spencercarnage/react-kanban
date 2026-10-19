import { findColumn } from "./findColumn";
import type { BoardState, ColumnId } from "./types";

/**
 * Moves an item to `toIndex` in `toColumn` (or to the end when omitted).
 * Returns the same board reference when nothing changes so React can bail out.
 */
export function moveItem(
  board: BoardState,
  itemId: string,
  toColumn: ColumnId,
  toIndex?: number,
): BoardState {
  const fromColumn = findColumn(board, itemId);
  if (!fromColumn) return board;

  const fromIndex = board.columns[fromColumn].indexOf(itemId);
  const source = board.columns[fromColumn].filter((id) => id !== itemId);
  const target = fromColumn === toColumn ? source : [...board.columns[toColumn]];
  const index = Math.min(toIndex ?? target.length, target.length);

  if (fromColumn === toColumn && fromIndex === index) return board;

  target.splice(index, 0, itemId);

  return {
    ...board,
    columns: { ...board.columns, [fromColumn]: source, [toColumn]: target },
  };
}
