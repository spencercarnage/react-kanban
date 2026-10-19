import { COLUMN_IDS, type ColumnId } from "./types";

export const COLUMNS: { id: ColumnId; title: string }[] = [
  { id: "todo", title: "To Do" },
  { id: "doing", title: "Doing" },
  { id: "done", title: "Done" },
];

export function isColumnId(value: string): value is ColumnId {
  return (COLUMN_IDS as readonly string[]).includes(value);
}
