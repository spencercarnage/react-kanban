import { describe, expect, it } from "vitest";
import { moveItem } from "./moveItem";
import type { BoardState } from "./types";

const item = (id: string) => ({ id, title: id, description: "", characterIds: ["1"] });

const board: BoardState = {
  items: { a: item("a"), b: item("b"), c: item("c"), d: item("d") },
  columns: { todo: ["a", "b", "c"], doing: ["d"], done: [] },
};

describe("moveItem", () => {
  it("appends to the end of another column when no index is given", () => {
    const next = moveItem(board, "a", "doing");

    expect(next.columns).toEqual({ todo: ["b", "c"], doing: ["d", "a"], done: [] });
  });

  it("inserts at the given index in another column", () => {
    const next = moveItem(board, "c", "doing", 0);

    expect(next.columns).toEqual({ todo: ["a", "b"], doing: ["c", "d"], done: [] });
  });

  it("reorders down within the same column", () => {
    const next = moveItem(board, "a", "todo", 2);

    expect(next.columns.todo).toEqual(["b", "c", "a"]);
  });

  it("reorders up within the same column", () => {
    const next = moveItem(board, "c", "todo", 0);

    expect(next.columns.todo).toEqual(["c", "a", "b"]);
  });

  it("clamps an out-of-range index to the end of the column", () => {
    const next = moveItem(board, "a", "done", 99);

    expect(next.columns.done).toEqual(["a"]);
  });

  it("returns the same board when the item is already at that position", () => {
    expect(moveItem(board, "b", "todo", 1)).toBe(board);
  });

  it("returns the same board for an unknown item", () => {
    expect(moveItem(board, "nope", "done")).toBe(board);
  });

  it("does not mutate the original board", () => {
    moveItem(board, "a", "doing");

    expect(board.columns).toEqual({ todo: ["a", "b", "c"], doing: ["d"], done: [] });
  });
});
