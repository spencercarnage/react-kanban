import { createContext, type ActionDispatch } from "react";
import type { BoardAction, BoardStore } from "@/utils/board/boardReducer";

// State and dispatch live in separate contexts so components that only
// dispatch (forms, menus) don't re-render on every board change.
export const BoardStateContext = createContext<BoardStore | null>(null);
export const BoardDispatchContext = createContext<ActionDispatch<[BoardAction]> | null>(null);
