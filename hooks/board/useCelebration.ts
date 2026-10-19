import { useBoardDispatch } from "./useBoardDispatch";
import { useBoardStore } from "./useBoardStore";

export function useCelebration() {
  const { celebratingItemId } = useBoardStore();
  const dispatch = useBoardDispatch();

  return {
    celebratingItemId,
    endCelebration: () => dispatch({ type: "endCelebration" }),
  };
}
