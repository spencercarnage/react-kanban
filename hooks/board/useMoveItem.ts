import type { DropPosition } from "@/utils/board/moveItemNextTo";
import type { ColumnId } from "@/utils/board/types";
import { useBoardDispatch } from "./useBoardDispatch";

export function useMoveItem() {
  const dispatch = useBoardDispatch();

  return {
    /** Move an item directly. Celebrates when it enters Done. */
    moveItem: (itemId: string, toColumn: ColumnId, toIndex?: number) =>
      dispatch({ type: "move", itemId, toColumn, toIndex }),
    /** Move an item live while it is being dragged. Never celebrates. */
    previewMove: (itemId: string, toColumn: ColumnId, toIndex?: number) =>
      dispatch({ type: "preview", itemId, toColumn, toIndex }),
    /** Move an item live beside another item while it is being dragged. Never celebrates. */
    previewMoveNextTo: (itemId: string, targetId: string, position: DropPosition) =>
      dispatch({ type: "previewNextTo", itemId, targetId, position }),
    /** Finish a drag that started in `originColumn`. */
    dropItem: (itemId: string, originColumn: ColumnId) =>
      dispatch({ type: "drop", itemId, originColumn }),
  };
}
