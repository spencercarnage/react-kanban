import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderBoardHooks } from "./renderBoardHooks";

function setup() {
  const hooks = renderBoardHooks();
  const ids: string[] = [];
  for (const title of ["a", "b", "c"]) {
    act(() => {
      ids.push(hooks.result.current.createItem({ title, description: "", characterIds: ["1"] }));
    });
  }
  return { ...hooks, ids };
}

describe("useMoveItem", () => {
  describe("moveItem", () => {
    it("moves an item into another column at the given index", () => {
      const { result, ids } = setup();
      const [a, b, c] = ids;

      act(() => result.current.moveItem(a, "doing"));
      act(() => result.current.moveItem(c, "doing", 0));

      expect(result.current.board.columns).toEqual({ todo: [b], doing: [c, a], done: [] });
    });

    it("reorders an item within its column", () => {
      const { result, ids } = setup();
      const [a, b, c] = ids;

      act(() => result.current.moveItem(c, "todo", 0));

      expect(result.current.board.columns.todo).toEqual([c, a, b]);
    });

    it("celebrates an item moved into Done", () => {
      const { result, ids } = setup();

      act(() => result.current.moveItem(ids[1], "done"));

      expect(result.current.celebratingItemId).toBe(ids[1]);
    });

    it("does not celebrate moves outside Done", () => {
      const { result, ids } = setup();

      act(() => result.current.moveItem(ids[0], "doing"));

      expect(result.current.celebratingItemId).toBeNull();
    });

    it("does not celebrate reordering within Done", () => {
      const { result, ids } = setup();
      act(() => result.current.moveItem(ids[0], "done"));
      act(() => result.current.moveItem(ids[1], "done"));
      act(() => result.current.endCelebration());

      act(() => result.current.moveItem(ids[1], "done", 0));

      expect(result.current.celebratingItemId).toBeNull();
    });

    it("restores moves after a reload", () => {
      const first = setup();
      const [a, b, c] = first.ids;
      act(() => first.result.current.moveItem(b, "done"));
      first.unmount();

      const { result } = renderBoardHooks();

      expect(result.current.board.columns).toEqual({ todo: [a, c], doing: [], done: [b] });
    });
  });

  describe("drag and drop", () => {
    it("previews a move into Done without celebrating", () => {
      const { result, ids } = setup();

      act(() => result.current.previewMove(ids[0], "done", 0));

      expect(result.current.board.columns.done).toEqual([ids[0]]);
      expect(result.current.celebratingItemId).toBeNull();
    });

    it("previews a move next to another item without celebrating", () => {
      const { result, ids } = setup();
      const [a, b, c] = ids;
      act(() => result.current.moveItem(a, "done"));
      act(() => result.current.endCelebration());

      act(() => result.current.previewMoveNextTo(c, a, "before"));

      expect(result.current.board.columns).toEqual({ todo: [b], doing: [], done: [c, a] });
      expect(result.current.celebratingItemId).toBeNull();
    });

    it("celebrates when a drag that started outside Done is dropped in Done", () => {
      const { result, ids } = setup();

      act(() => result.current.previewMove(ids[0], "done", 0));
      act(() => result.current.dropItem(ids[0], "todo"));

      expect(result.current.celebratingItemId).toBe(ids[0]);
    });

    it("does not celebrate a drop outside Done", () => {
      const { result, ids } = setup();

      act(() => result.current.previewMove(ids[0], "doing", 0));
      act(() => result.current.dropItem(ids[0], "todo"));

      expect(result.current.celebratingItemId).toBeNull();
    });

    it("does not celebrate a drag that started in Done", () => {
      const { result, ids } = setup();
      act(() => result.current.moveItem(ids[0], "done"));
      act(() => result.current.endCelebration());

      act(() => result.current.dropItem(ids[0], "done"));

      expect(result.current.celebratingItemId).toBeNull();
    });
  });
});

describe("useCelebration", () => {
  it("ends the celebration", () => {
    const { result, ids } = setup();
    act(() => result.current.moveItem(ids[0], "done"));

    act(() => result.current.endCelebration());

    expect(result.current.celebratingItemId).toBeNull();
  });
});
