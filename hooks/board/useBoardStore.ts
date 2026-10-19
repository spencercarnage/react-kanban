import { use } from "react";
import { BoardStateContext } from "./BoardContext";

export function useBoardStore() {
  const store = use(BoardStateContext);
  if (!store) throw new Error("useBoardStore must be used inside <BoardProvider>");
  return store;
}
