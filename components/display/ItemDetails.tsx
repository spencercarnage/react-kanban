"use client";

import Button from "@/components/inputs/Button";
import { useBoardStore } from "@/hooks/board/useBoardStore";
import { COLUMNS } from "@/utils/board/columns";
import type { ColumnId } from "@/utils/board/types";
import AssigneeList from "./AssigneeList";

type ItemDetailsProps = {
  itemId: string;
  columnId: ColumnId;
  onEdit: () => void;
  onDelete: () => void;
};

/** The full contents of a task, shown in its view modal. */
export default function ItemDetails({ itemId, columnId, onEdit, onDelete }: ItemDetailsProps) {
  const { board } = useBoardStore();
  const item = board.items[itemId];
  const column = COLUMNS.find(({ id }) => id === columnId);

  return (
    <div className="flex flex-col gap-4">
      <p>
        <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
          {column?.title}
        </span>
      </p>
      {item.description ? (
        <p className="whitespace-pre-wrap text-sm leading-relaxed">{item.description}</p>
      ) : (
        <p className="text-sm italic text-zinc-500">No description.</p>
      )}
      <section className="flex flex-col gap-2">
        <h3 className="text-sm font-medium">Assignees</h3>
        <AssigneeList characterIds={item.characterIds} />
      </section>
      <div className="flex justify-end gap-2">
        <Button variant="ghost" onClick={onDelete}>
          Delete
        </Button>
        <Button variant="secondary" onClick={onEdit}>
          Edit
        </Button>
      </div>
    </div>
  );
}
