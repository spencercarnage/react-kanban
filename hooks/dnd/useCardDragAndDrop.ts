import { useCallback, useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useMoveItem } from "@/hooks/board/useMoveItem";
import type { ColumnId } from "@/utils/board/types";
import { CARD, type CardDragItem } from "@/utils/dnd/dragTypes";

/**
 * Makes a card draggable and a reorder target. Hovering another card moves
 * the dragged card before or after it, depending on which half the pointer is in.
 */
export function useCardDragAndDrop(itemId: string, columnId: ColumnId) {
  const ref = useRef<HTMLElement>(null);
  const { previewMoveNextTo } = useMoveItem();

  const [{ isDragging }, drag] = useDrag({
    type: CARD,
    item: (): CardDragItem => ({ id: itemId, originColumn: columnId }),
    // The card remounts when it moves to another column, so compare by id
    // rather than by drag source.
    isDragging: (monitor) => monitor.getItem<CardDragItem>().id === itemId,
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const [, drop] = useDrop<CardDragItem>({
    accept: CARD,
    hover(item, monitor) {
      const offset = monitor.getClientOffset();
      if (!ref.current || !offset || item.id === itemId) return;

      const rect = ref.current.getBoundingClientRect();
      const position = offset.y - rect.top > rect.height / 2 ? "after" : "before";
      previewMoveNextTo(item.id, itemId, position);
    },
  });

  // Connect in a callback ref (commit time) rather than during render.
  const connectRef = useCallback(
    (node: HTMLElement | null) => {
      ref.current = node;
      drag(drop(node));
    },
    [drag, drop],
  );

  return { ref: connectRef, isDragging };
}
