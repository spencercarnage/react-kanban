export const COLUMN_IDS = ["todo", "doing", "done"] as const;

export type ColumnId = (typeof COLUMN_IDS)[number];

export type BoardItem = {
  id: string;
  title: string;
  description: string;
  /** Assigned Rick and Morty character ids. */
  characterIds: string[];
};

/** The editable fields of an item, as entered in the item form. */
export type ItemInput = Omit<BoardItem, "id">;

export type BoardState = {
  items: Record<string, BoardItem>;
  columns: Record<ColumnId, string[]>;
};
