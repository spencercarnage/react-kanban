"use client";

import { useId } from "react";
import { useMoveItem } from "@/hooks/board/useMoveItem";
import { COLUMNS, isColumnId } from "@/utils/board/columns";
import type { ColumnId } from "@/utils/board/types";

type MoveToSelectProps = {
  itemId: string;
  columnId: ColumnId;
};

/** Keyboard and screen reader alternative to dragging a card. */
export default function MoveToSelect({ itemId, columnId }: MoveToSelectProps) {
  const id = useId();
  const { moveItem } = useMoveItem();

  return (
    <div>
      <label htmlFor={id} className="sr-only">
        Move to
      </label>
      <select
        id={id}
        value=""
        onChange={(event) => {
          if (isColumnId(event.target.value)) moveItem(itemId, event.target.value);
        }}
        className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-2 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
      >
        <option value="" disabled>
          Move to…
        </option>
        {COLUMNS.filter((column) => column.id !== columnId).map((column) => (
          <option key={column.id} value={column.id}>
            {column.title}
          </option>
        ))}
      </select>
    </div>
  );
}
