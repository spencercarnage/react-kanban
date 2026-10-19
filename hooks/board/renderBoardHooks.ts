import { renderHook } from "@testing-library/react";
import BoardProvider from "@/components/utils/BoardProvider";
import { useBoardStore } from "./useBoardStore";
import { useCelebration } from "./useCelebration";
import { useCreateItem } from "./useCreateItem";
import { useDeleteItem } from "./useDeleteItem";
import { useMoveItem } from "./useMoveItem";
import { useUpdateItem } from "./useUpdateItem";

/** Test helper: renders every board hook against one real BoardProvider. */
export function renderBoardHooks() {
  return renderHook(
    () => ({
      ...useBoardStore(),
      ...useMoveItem(),
      ...useCelebration(),
      createItem: useCreateItem(),
      updateItem: useUpdateItem(),
      deleteItem: useDeleteItem(),
    }),
    { wrapper: BoardProvider },
  );
}
