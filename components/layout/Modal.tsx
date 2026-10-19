"use client";

import { useId, type ReactNode } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  title: string;
  onClose: () => void;
  children: ReactNode;
};

// Callback ref: opens the dialog as a modal as soon as it mounts.
function showModal(dialog: HTMLDialogElement | null) {
  if (dialog && !dialog.open) dialog.showModal();
}

/**
 * A native modal <dialog>. Render it to open it, unmount it to close it.
 * Escape, the close button and clicking the backdrop all call `onClose`.
 * It is portaled to <body> so it isn't inside a draggable card's DOM.
 */
export default function Modal({ title, onClose, children }: ModalProps) {
  const titleId = useId();

  return createPortal(
    // The dialog element itself only receives clicks on its backdrop; Escape is handled natively.
    <dialog
      ref={showModal}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      className="m-auto w-[min(32rem,calc(100%-2rem))] rounded-2xl bg-white p-0 text-foreground shadow-xl backdrop:bg-zinc-950/50 backdrop:backdrop-blur-sm dark:bg-zinc-900"
    >
      <div className="flex flex-col gap-4 p-5">
        <header className="flex items-start justify-between gap-4">
          <h2 id={titleId} className="text-lg font-semibold">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="-mr-1 -mt-1 rounded-lg px-2 py-1 text-xl leading-none text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            ×
          </button>
        </header>
        {children}
      </div>
    </dialog>,
    document.body,
  );
}
