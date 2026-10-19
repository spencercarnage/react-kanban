"use client";

import classNames from "classnames";
import { useId } from "react";
import AddItemButton from "@/components/inputs/AddItemButton";
import { useBoardStore } from "@/hooks/board/useBoardStore";
import { useColumnDropTarget } from "@/hooks/dnd/useColumnDropTarget";
import type { ColumnId } from "@/utils/board/types";
import ColumnHeader from "./ColumnHeader";
import EmptyColumn from "./EmptyColumn";
import ItemCard from "./ItemCard";

type BoardColumnProps = {
  columnId: ColumnId;
  title: string;
};

export default function BoardColumn({ columnId, title }: BoardColumnProps) {
  const headingId = useId();
  const { board } = useBoardStore();
  const { ref, isOver } = useColumnDropTarget(columnId);
  const itemIds = board.columns[columnId];

  return (
    <section
      aria-labelledby={headingId}
      className={classNames(
        "flex flex-col gap-3 rounded-2xl border bg-zinc-100/80 p-3 transition-colors dark:bg-zinc-900/60",
        isOver ? "border-lime-400 bg-lime-50 dark:bg-lime-950/30" : "border-zinc-200 dark:border-zinc-800",
      )}
    >
      <ColumnHeader
        id={headingId}
        title={title}
        count={itemIds.length}
        action={columnId === "todo" && <AddItemButton />}
      />
      <ol ref={ref} className="flex min-h-40 flex-col gap-3">
        {itemIds.map((itemId) => (
          <li key={itemId}>
            <ItemCard itemId={itemId} columnId={columnId} />
          </li>
        ))}
        {itemIds.length === 0 && <EmptyColumn />}
      </ol>
    </section>
  );
}
