import { use } from "react";
import { BoardDispatchContext } from "./BoardContext";

export function useBoardDispatch() {
  const dispatch = use(BoardDispatchContext);
  if (!dispatch) throw new Error("useBoardDispatch must be used inside <BoardProvider>");
  return dispatch;
}
