import { findColumn } from "./findColumn";
import { moveItem } from "./moveItem";
import { moveItemNextTo, type DropPosition } from "./moveItemNextTo";
import type { BoardItem, BoardState, ColumnId, ItemInput } from "./types";

export type BoardStore = {
  board: BoardState;
  /** The item currently playing the "moved to Done" animation. */
  celebratingItemId: string | null;
};

export type BoardAction =
  | { type: "create"; item: BoardItem }
  | { type: "update"; itemId: string; input: ItemInput }
  | { type: "delete"; itemId: string }
  /** A deliberate move (e.g. the "Move to" menu). Celebrates on entering Done. */
  | { type: "move"; itemId: string; toColumn: ColumnId; toIndex?: number }
  /** A live move while dragging. Never celebrates; the drop decides. */
  | { type: "preview"; itemId: string; toColumn: ColumnId; toIndex?: number }
  /** A live move beside another item while dragging. Never celebrates. */
  | { type: "previewNextTo"; itemId: string; targetId: string; position: DropPosition }
  /** A drag ended. Celebrates if it started outside Done and ended in Done. */
  | { type: "drop"; itemId: string; originColumn: ColumnId }
  | { type: "endCelebration" };

export function boardReducer(store: BoardStore, action: BoardAction): BoardStore {
  switch (action.type) {
    case "create": {
      const { board } = store;
      return {
        ...store,
        board: {
          items: { ...board.items, [action.item.id]: action.item },
          columns: { ...board.columns, todo: [...board.columns.todo, action.item.id] },
        },
      };
    }
    case "update": {
      const item = store.board.items[action.itemId];
      if (!item) return store;
      return {
        ...store,
        board: {
          ...store.board,
          items: { ...store.board.items, [item.id]: { ...item, ...action.input } },
        },
      };
    }
    case "delete": {
      const columnId = findColumn(store.board, action.itemId);
      if (!columnId) return store;
      const items = { ...store.board.items };
      delete items[action.itemId];
      return {
        board: {
          items,
          columns: {
            ...store.board.columns,
            [columnId]: store.board.columns[columnId].filter((id) => id !== action.itemId),
          },
        },
        celebratingItemId:
          store.celebratingItemId === action.itemId ? null : store.celebratingItemId,
      };
    }
    case "move": {
      const fromColumn = findColumn(store.board, action.itemId);
      const board = moveItem(store.board, action.itemId, action.toColumn, action.toIndex);
      const entersDone = fromColumn !== "done" && action.toColumn === "done";
      return {
        board,
        celebratingItemId: entersDone ? action.itemId : store.celebratingItemId,
      };
    }
    case "preview": {
      const board = moveItem(store.board, action.itemId, action.toColumn, action.toIndex);
      return board === store.board ? store : { ...store, board };
    }
    case "previewNextTo": {
      const board = moveItemNextTo(store.board, action.itemId, action.targetId, action.position);
      return board === store.board ? store : { ...store, board };
    }
    case "drop": {
      const entersDone =
        action.originColumn !== "done" && findColumn(store.board, action.itemId) === "done";
      return entersDone ? { ...store, celebratingItemId: action.itemId } : store;
    }
    case "endCelebration":
      return { ...store, celebratingItemId: null };
  }
}
