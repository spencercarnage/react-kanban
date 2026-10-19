import { COLUMN_IDS, type BoardState, type ColumnId } from "./types";

export function findColumn(board: BoardState, itemId: string): ColumnId | undefined {
  return COLUMN_IDS.find((columnId) => board.columns[columnId].includes(itemId));
}
