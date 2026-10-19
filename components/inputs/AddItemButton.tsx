"use client";

import { useState } from "react";
import Modal from "@/components/layout/Modal";
import { useCreateItem } from "@/hooks/board/useCreateItem";
import { EMPTY_ITEM_INPUT } from "@/utils/board/emptyItemInput";
import Button from "./Button";
import ItemForm from "./ItemForm";

export default function AddItemButton() {
  const [open, setOpen] = useState(false);
  const createItem = useCreateItem();

  return (
    <>
      <Button size="sm" onClick={() => setOpen(true)}>
        <span aria-hidden>+ </span>Add
      </Button>
      {open && (
        <Modal title="New task" onClose={() => setOpen(false)}>
          <ItemForm
            defaultValues={EMPTY_ITEM_INPUT}
            submitLabel="Add task"
            onSubmit={(input) => {
              createItem(input);
              setOpen(false);
            }}
          />
        </Modal>
      )}
    </>
  );
}
