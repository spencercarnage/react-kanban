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

describe("useDeleteItem", () => {
  it("removes the item from its column and the board", () => {
    const { result, ids } = setup();
    const [a, b, c] = ids;

    act(() => result.current.deleteItem(b));

    expect(result.current.board.columns.todo).toEqual([a, c]);
    expect(result.current.board.items[b]).toBeUndefined();
  });

  it("removes an item from whichever column it is in", () => {
    const { result, ids } = setup();
    const [a, b, c] = ids;
    act(() => result.current.moveItem(c, "doing"));

    act(() => result.current.deleteItem(c));

    expect(result.current.board.columns).toEqual({ todo: [a, b], doing: [], done: [] });
  });

  it("stops the celebration of a deleted item", () => {
    const { result, ids } = setup();
    act(() => result.current.moveItem(ids[0], "done"));

    act(() => result.current.deleteItem(ids[0]));

    expect(result.current.celebratingItemId).toBeNull();
  });

  it("ignores unknown items", () => {
    const { result } = setup();
    const before = result.current.board;

    act(() => result.current.deleteItem("nope"));

    expect(result.current.board).toBe(before);
  });

  it("stays deleted after a reload", () => {
    const first = setup();
    const [a, b, c] = first.ids;
    act(() => first.result.current.deleteItem(a));
    first.unmount();

    const { result } = renderBoardHooks();

    expect(result.current.board.columns.todo).toEqual([b, c]);
    expect(result.current.board.items[a]).toBeUndefined();
  });
});
