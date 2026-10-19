import { useBoardDispatch } from "./useBoardDispatch";

/** Returns a function that removes an item from the board. */
export function useDeleteItem() {
  const dispatch = useBoardDispatch();

  return (itemId: string) => dispatch({ type: "delete", itemId });
}
