import type { ColumnId } from "@/utils/board/types";

export const CARD = "card";

export type CardDragItem = {
  id: string;
  /** Column the drag started in. Used to decide whether a drop should celebrate. */
  originColumn: ColumnId;
};
