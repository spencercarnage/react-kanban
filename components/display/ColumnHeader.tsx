import type { ReactNode } from "react";

type ColumnHeaderProps = {
  id: string;
  title: string;
  count: number;
  /** Optional control shown next to the count, e.g. the Add button. */
  action?: ReactNode;
};

export default function ColumnHeader({ id, title, count, action }: ColumnHeaderProps) {
  return (
    <header className="flex items-center gap-2 px-1">
      <h2 id={id} className="font-semibold">
        {title}
      </h2>
      <span className="rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
        {count}
      </span>
      {action && <div className="ml-auto">{action}</div>}
    </header>
  );
}
