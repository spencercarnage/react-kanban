import { useCallback } from "react";
import { useDrop } from "react-dnd";
import { useBoardStore } from "@/hooks/board/useBoardStore";
import { useMoveItem } from "@/hooks/board/useMoveItem";
import { findColumn } from "@/utils/board/findColumn";
import type { ColumnId } from "@/utils/board/types";
import { CARD, type CardDragItem } from "@/utils/dnd/dragTypes";

/**
 * Makes a column a drop target. Hovering empty space in the column appends
 * the card; dropping anywhere in the column finishes the drag.
 */
export function useColumnDropTarget(columnId: ColumnId) {
  const { board } = useBoardStore();
  const { previewMove, dropItem } = useMoveItem();

  const [{ isOver }, drop] = useDrop<CardDragItem, void, { isOver: boolean }>({
    accept: CARD,
    hover(item, monitor) {
      // Hovering a card is handled by that card's own drop target.
      if (!monitor.isOver({ shallow: true })) return;
      if (findColumn(board, item.id) === columnId) return;
      previewMove(item.id, columnId);
    },
    drop: (item) => dropItem(item.id, item.originColumn),
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  // Connect in a callback ref (commit time) rather than during render.
  const ref = useCallback(
    (node: HTMLElement | null) => {
      drop(node);
    },
    [drop],
  );

  return { ref, isOver };
}
