"use client";

import classNames from "classnames";
import { useState, type MouseEvent } from "react";
import Button from "@/components/inputs/Button";
import ItemForm from "@/components/inputs/ItemForm";
import MoveToSelect from "@/components/inputs/MoveToSelect";
import Modal from "@/components/layout/Modal";
import { useBoardStore } from "@/hooks/board/useBoardStore";
import { useCelebration } from "@/hooks/board/useCelebration";
import { useDeleteItem } from "@/hooks/board/useDeleteItem";
import { useUpdateItem } from "@/hooks/board/useUpdateItem";
import { useCardDragAndDrop } from "@/hooks/dnd/useCardDragAndDrop";
import { previewDescription } from "@/utils/board/previewDescription";
import type { ColumnId } from "@/utils/board/types";
import AssigneeList from "./AssigneeList";
import Celebration from "./Celebration";
import ItemDetails from "./ItemDetails";

type ItemCardProps = {
  itemId: string;
  columnId: ColumnId;
};

const INTERACTIVE = "a, button, input, label, select, textarea";

/**
 * Whether a click on the card should open the view modal. Controls handle their
 * own clicks. React bubbles events through portals, so clicks inside this card's
 * modals reach the card too, even though they aren't in its DOM.
 * (Browsers don't fire a click after a drag, so dragging never opens it.)
 */
function opensDetails(event: MouseEvent<HTMLElement>) {
  const target = event.target as Element;
  return event.currentTarget.contains(target) && !target.closest(INTERACTIVE);
}

export default function ItemCard({ itemId, columnId }: ItemCardProps) {
  const [dialog, setDialog] = useState<"view" | "edit" | "delete" | null>(null);
  const { board } = useBoardStore();
  const { celebratingItemId, endCelebration } = useCelebration();
  const updateItem = useUpdateItem();
  const deleteItem = useDeleteItem();
  const { ref, isDragging } = useCardDragAndDrop(itemId, columnId);
  const item = board.items[itemId];
  const celebrating = celebratingItemId === itemId;
  const preview = previewDescription(item.description);
  const closeDialog = () => setDialog(null);

  return (
    <article
      ref={ref}
      aria-label={item.title}
      onClick={(event) => {
        if (opensDetails(event)) setDialog("view");
      }}
      className={classNames(
        "relative flex cursor-grab flex-col gap-3 rounded-xl border bg-white p-3 shadow-sm transition-opacity active:cursor-grabbing dark:bg-zinc-800",
        isDragging ? "opacity-40" : "opacity-100",
        celebrating
          ? "border-lime-400 motion-safe:animate-portal"
          : "border-zinc-200 dark:border-zinc-700",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-medium leading-snug">
          <button
            type="button"
            onClick={() => setDialog("view")}
            className="text-left hover:underline focus-visible:outline-2 focus-visible:outline-lime-500"
          >
            {item.title}
          </button>
        </h3>
        <div className="flex shrink-0 gap-1">
          <Button variant="ghost" size="sm" onClick={() => setDialog("edit")}>
            Edit
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setDialog("delete")}>
            Delete
          </Button>
        </div>
      </div>
      {preview && <p className="text-sm text-zinc-600 dark:text-zinc-400">{preview}</p>}
      <AssigneeList characterIds={item.characterIds} />
      <MoveToSelect itemId={itemId} columnId={columnId} />
      {celebrating && <Celebration onComplete={endCelebration} />}

      {dialog === "view" && (
        <Modal title={item.title} onClose={closeDialog}>
          <ItemDetails
            itemId={itemId}
            columnId={columnId}
            onEdit={() => setDialog("edit")}
            onDelete={() => setDialog("delete")}
          />
        </Modal>
      )}
      {dialog === "edit" && (
        <Modal title="Edit task" onClose={closeDialog}>
          <ItemForm
            defaultValues={item}
            submitLabel="Save"
            onSubmit={(input) => {
              updateItem(itemId, input);
              closeDialog();
            }}
          />
        </Modal>
      )}
      {dialog === "delete" && (
        <Modal title="Delete task?" onClose={closeDialog}>
          <p className="text-sm">
            <strong className="font-semibold">{item.title}</strong> will be removed from the board.
            This can&apos;t be undone.
          </p>
          <div className="flex justify-end gap-2">
            <Button variant="secondary" onClick={closeDialog}>
              Cancel
            </Button>
            {/* Unmounts this card, and the modal with it. */}
            <Button variant="danger" onClick={() => deleteItem(itemId)}>
              Delete
            </Button>
          </div>
        </Modal>
      )}
    </article>
  );
}
