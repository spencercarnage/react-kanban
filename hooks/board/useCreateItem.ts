import { normalizeItemInput } from "@/utils/board/normalizeItemInput";
import type { ItemInput } from "@/utils/board/types";
import { useBoardDispatch } from "./useBoardDispatch";

/** Returns a function that adds an item to the end of To Do and returns its id. */
export function useCreateItem() {
  const dispatch = useBoardDispatch();

  return (input: ItemInput) => {
    const id = crypto.randomUUID();
    dispatch({ type: "create", item: { id, ...normalizeItemInput(input) } });
    return id;
  };
}
