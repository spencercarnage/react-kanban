import { normalizeItemInput } from "@/utils/board/normalizeItemInput";
import type { ItemInput } from "@/utils/board/types";
import { useBoardDispatch } from "./useBoardDispatch";

/** Returns a function that replaces an item's title, description and assignees. */
export function useUpdateItem() {
  const dispatch = useBoardDispatch();

  return (itemId: string, input: ItemInput) =>
    dispatch({ type: "update", itemId, input: normalizeItemInput(input) });
}
