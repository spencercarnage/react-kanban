import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderBoardHooks } from "./renderBoardHooks";

function setup() {
  const hooks = renderBoardHooks();
  let id = "";
  act(() => {
    id = hooks.result.current.createItem({
      title: "Get schwifty",
      description: "Show me what you got.",
      characterIds: ["1"],
    });
  });
  return { ...hooks, id };
}

describe("useUpdateItem", () => {
  it("replaces the title, description and assignees", () => {
    const { result, id } = setup();

    act(() =>
      result.current.updateItem(id, {
        title: "Get riggity",
        description: "Wrecked.",
        characterIds: ["2", "3"],
      }),
    );

    expect(result.current.board.items[id]).toEqual({
      id,
      title: "Get riggity",
      description: "Wrecked.",
      characterIds: ["2", "3"],
    });
  });

  it("trims the title and description", () => {
    const { result, id } = setup();

    act(() =>
      result.current.updateItem(id, {
        title: "  Get riggity ",
        description: " Wrecked.  ",
        characterIds: ["2"],
      }),
    );

    expect(result.current.board.items[id].title).toBe("Get riggity");
    expect(result.current.board.items[id].description).toBe("Wrecked.");
  });

  it("keeps the item in its column and position", () => {
    const { result, id } = setup();
    let other = "";
    act(() => {
      other = result.current.createItem({ title: "b", description: "", characterIds: ["1"] });
    });
    act(() => result.current.moveItem(id, "doing"));

    act(() =>
      result.current.updateItem(id, { title: "Get riggity", description: "", characterIds: ["1"] }),
    );

    expect(result.current.board.columns).toEqual({ todo: [other], doing: [id], done: [] });
  });

  it("ignores unknown items", () => {
    const { result } = setup();
    const before = result.current.board;

    act(() => result.current.updateItem("nope", { title: "x", description: "", characterIds: [] }));

    expect(result.current.board).toBe(before);
  });

  it("restores updates after a reload", () => {
    const first = setup();
    act(() =>
      first.result.current.updateItem(first.id, {
        title: "Get riggity",
        description: "Wrecked.",
        characterIds: ["2"],
      }),
    );
    first.unmount();

    const { result } = renderBoardHooks();

    expect(result.current.board.items[first.id].title).toBe("Get riggity");
  });
});
