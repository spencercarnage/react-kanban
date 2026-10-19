import { act } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { renderBoardHooks } from "./renderBoardHooks";

const GET_SCHWIFTY = {
  title: "Get schwifty",
  description: "Show me what you got.",
  characterIds: ["1", "2"],
};

describe("useCreateItem", () => {
  it("adds the item to the end of To Do with its title, description and assignees", () => {
    const { result } = renderBoardHooks();

    let first = "";
    let second = "";
    act(() => {
      first = result.current.createItem(GET_SCHWIFTY);
    });
    act(() => {
      second = result.current.createItem({
        title: "Pass the butter",
        description: "",
        characterIds: ["3"],
      });
    });

    expect(result.current.board.columns.todo).toEqual([first, second]);
    expect(result.current.board.items[first]).toEqual({ id: first, ...GET_SCHWIFTY });
  });

  it("trims the title and description", () => {
    const { result } = renderBoardHooks();

    let id = "";
    act(() => {
      id = result.current.createItem({
        title: "  Get schwifty  ",
        description: "  Show me what you got.  ",
        characterIds: ["1"],
      });
    });

    expect(result.current.board.items[id].title).toBe("Get schwifty");
    expect(result.current.board.items[id].description).toBe("Show me what you got.");
  });

  it("restores created items after a reload", () => {
    const first = renderBoardHooks();
    let id = "";
    act(() => {
      id = first.result.current.createItem(GET_SCHWIFTY);
    });
    first.unmount();

    const { result } = renderBoardHooks();

    expect(result.current.board.columns.todo).toEqual([id]);
    expect(result.current.board.items[id]).toEqual({ id, ...GET_SCHWIFTY });
  });
});
