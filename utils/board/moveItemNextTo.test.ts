import { describe, expect, it } from "vitest";
import { moveItemNextTo } from "./moveItemNextTo";
import type { BoardState } from "./types";

const item = (id: string) => ({ id, title: id, description: "", characterIds: ["1"] });

const board: BoardState = {
  items: { a: item("a"), b: item("b"), c: item("c"), d: item("d") },
  columns: { todo: ["a", "b", "c"], doing: ["d"], done: [] },
};

describe("moveItemNextTo", () => {
  it("places an item before the target in the same column", () => {
    expect(moveItemNextTo(board, "c", "b", "before").columns.todo).toEqual(["a", "c", "b"]);
  });

  it("places an item after the target in the same column", () => {
    expect(moveItemNextTo(board, "a", "b", "after").columns.todo).toEqual(["b", "a", "c"]);
  });

  it("places an item before the target in another column", () => {
    const next = moveItemNextTo(board, "b", "d", "before");

    expect(next.columns).toEqual({ todo: ["a", "c"], doing: ["b", "d"], done: [] });
  });

  it("places an item after the target in another column", () => {
    const next = moveItemNextTo(board, "b", "d", "after");

    expect(next.columns).toEqual({ todo: ["a", "c"], doing: ["d", "b"], done: [] });
  });

  it("returns the same board when the item is already in place", () => {
    expect(moveItemNextTo(board, "a", "b", "before")).toBe(board);
  });

  it("returns the same board when the target is the item itself", () => {
    expect(moveItemNextTo(board, "a", "a", "after")).toBe(board);
  });
});
