import { act, fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RelayEnvironmentProvider } from "react-relay";
import type { OperationDescriptor } from "relay-runtime";
import { createMockEnvironment, MockPayloadGenerator } from "relay-test-utils";
import { describe, expect, it } from "vitest";
import BoardProvider from "@/components/utils/BoardProvider";
import type { BoardState } from "@/utils/board/types";
import Board from "./Board";

const CHARACTERS: Record<string, { name: string; species: string; status: string } | null> = {
  "1": { name: "Rick Sanchez", species: "Human", status: "Alive" },
  "2": { name: "Morty Smith", species: "Human", status: "Alive" },
  "3": { name: "Summer Smith", species: "Human", status: "Alive" },
  "999": null,
};

const BOARD: BoardState = {
  items: {
    portal: {
      id: "portal",
      title: "Fix the portal gun",
      description: "It's leaking again. Use the plumbus. Don't tell Morty.",
      characterIds: ["1", "2"],
    },
    school: { id: "school", title: "Go to school", description: "", characterIds: ["2"] },
    lost: { id: "lost", title: "Find the lost one", description: "", characterIds: ["999"] },
  },
  columns: { todo: ["portal", "school"], doing: ["lost"], done: [] },
};

function characterPayload(id: string) {
  const character = CHARACTERS[id];
  return character && { id, image: `https://example.com/${id}.png`, ...character };
}

/** Answers every Relay request the board makes, however many there are. */
function resolveAllOperations(environment: ReturnType<typeof createMockEnvironment>) {
  const resolve = (operation: OperationDescriptor) => {
    // A fresh function each time, because the mock removes a used resolver by identity.
    environment.mock.queueOperationResolver((next) => resolve(next));
    const { name } = operation.request.node.params;
    if (name === "CharacterSearchResultsQuery") {
      const results = Object.keys(CHARACTERS).map(characterPayload).filter(Boolean);
      return MockPayloadGenerator.generate(operation, {
        Characters: () => ({ info: { count: results.length }, results }),
      });
    }
    const character = characterPayload(String(operation.request.variables.id));
    if (!character) return { data: { character: null } };
    return MockPayloadGenerator.generate(operation, { Character: () => character });
  };
  environment.mock.queueOperationResolver((operation) => resolve(operation));
}

function renderBoard(initialBoard: BoardState = BOARD) {
  const environment = createMockEnvironment();
  resolveAllOperations(environment);

  render(
    <RelayEnvironmentProvider environment={environment}>
      <BoardProvider initialBoard={initialBoard}>
        <DndProvider backend={HTML5Backend}>
          <Board />
        </DndProvider>
      </BoardProvider>
    </RelayEnvironmentProvider>,
  );
}

const column = (name: string) => screen.getByRole("region", { name });
const card = (title: string) => screen.getByRole("article", { name: title });

describe("Board", () => {
  it("renders the To Do, Doing and Done columns", () => {
    renderBoard();

    expect(column("To Do")).toBeInTheDocument();
    expect(column("Doing")).toBeInTheDocument();
    expect(column("Done")).toBeInTheDocument();
  });

  it("renders each card in its column", () => {
    renderBoard();

    expect(within(column("To Do")).getAllByRole("article").map((el) => el.ariaLabel)).toEqual([
      "Fix the portal gun",
      "Go to school",
    ]);
    expect(within(column("Doing")).getByRole("article")).toHaveAccessibleName("Find the lost one");
  });

  it("shows how many cards each column holds", () => {
    renderBoard();

    expect(within(column("To Do")).getByText("2")).toBeInTheDocument();
    expect(within(column("Done")).getByText("0")).toBeInTheDocument();
  });

  it("shows an empty state in a column with no cards", () => {
    renderBoard();

    expect(within(column("Done")).getByText(/drop cards here/i)).toBeInTheDocument();
  });

  it("shows the character assigned to each card", async () => {
    renderBoard();

    expect(await within(card("Fix the portal gun")).findByText("Rick Sanchez")).toBeInTheDocument();
    expect(await within(card("Go to school")).findByText("Morty Smith")).toBeInTheDocument();
  });

  it("shows a fallback when a card's character no longer exists", async () => {
    renderBoard();

    expect(
      await within(card("Find the lost one")).findByText(/unknown character/i),
    ).toBeInTheDocument();
  });

  it("moves a card to another column from its Move to menu", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.selectOptions(
      within(card("Go to school")).getByRole("combobox", { name: /move to/i }),
      "Doing",
    );

    expect(within(column("To Do")).queryByRole("article", { name: "Go to school" })).toBeNull();
    expect(within(column("Doing")).getByRole("article", { name: "Go to school" })).toBeInTheDocument();
  });

  it("only offers the other columns in the Move to menu", () => {
    renderBoard();

    const menu = within(card("Go to school")).getByRole("combobox", { name: /move to/i });

    expect(within(menu).queryByRole("option", { name: "To Do" })).toBeNull();
    expect(within(menu).getByRole("option", { name: "Doing" })).toBeInTheDocument();
    expect(within(menu).getByRole("option", { name: "Done" })).toBeInTheDocument();
  });

  it("celebrates a card moved to Done", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.selectOptions(
      within(card("Fix the portal gun")).getByRole("combobox", { name: /move to/i }),
      "Done",
    );

    expect(within(card("Fix the portal gun")).getByRole("status")).toHaveTextContent(
      /wubba lubba dub dub/i,
    );
  });

  it("does not celebrate a card moved anywhere else", async () => {
    const user = userEvent.setup();
    renderBoard();

    await user.selectOptions(
      within(card("Fix the portal gun")).getByRole("combobox", { name: /move to/i }),
      "Doing",
    );

    expect(screen.queryByText(/wubba lubba dub dub/i)).toBeNull();
  });

  it("clears the celebration when its animation finishes", async () => {
    const user = userEvent.setup();
    renderBoard();
    await user.selectOptions(
      within(card("Fix the portal gun")).getByRole("combobox", { name: /move to/i }),
      "Done",
    );

    act(() => {
      fireEvent.animationEnd(screen.getByText(/wubba lubba dub dub/i));
    });

    expect(screen.queryByText(/wubba lubba dub dub/i)).toBeNull();
  });

  describe("cards", () => {
    it("previews at most two sentences of the description", () => {
      renderBoard();

      expect(within(card("Fix the portal gun")).getByText(/it's leaking again/i)).toHaveTextContent(
        "It's leaking again. Use the plumbus.…",
      );
      expect(within(card("Fix the portal gun")).queryByText(/don't tell morty/i)).toBeNull();
    });

    it("shows every assignee", async () => {
      renderBoard();

      const portal = card("Fix the portal gun");
      expect(await within(portal).findByText("Rick Sanchez")).toBeInTheDocument();
      expect(await within(portal).findByText("Morty Smith")).toBeInTheDocument();
    });
  });

  describe("adding a task", () => {
    it("offers an Add button only in To Do", () => {
      renderBoard();

      expect(within(column("To Do")).getByRole("button", { name: "Add" })).toBeInTheDocument();
      expect(within(column("Doing")).queryByRole("button", { name: "Add" })).toBeNull();
      expect(within(column("Done")).queryByRole("button", { name: "Add" })).toBeNull();
    });

    it("opens the New task modal", async () => {
      const user = userEvent.setup();
      renderBoard();

      await user.click(within(column("To Do")).getByRole("button", { name: "Add" }));

      expect(screen.getByRole("dialog", { name: "New task" })).toBeInTheDocument();
    });

    it("creates a card at the end of To Do with its description and assignees", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(column("To Do")).getByRole("button", { name: "Add" }));
      const dialog = screen.getByRole("dialog", { name: "New task" });

      await user.type(within(dialog).getByLabelText("Title"), "Get schwifty");
      await user.type(within(dialog).getByLabelText("Description"), "Show me what you got.");
      await user.click(await within(dialog).findByRole("checkbox", { name: /rick sanchez/i }));
      await user.click(within(dialog).getByRole("checkbox", { name: /summer smith/i }));
      await user.click(within(dialog).getByRole("button", { name: "Add task" }));

      expect(screen.queryByRole("dialog")).toBeNull();
      const cards = within(column("To Do")).getAllByRole("article");
      expect(cards.at(-1)).toHaveAccessibleName("Get schwifty");
      const created = card("Get schwifty");
      expect(within(created).getByText("Show me what you got.")).toBeInTheDocument();
      expect(await within(created).findByText("Rick Sanchez")).toBeInTheDocument();
      expect(await within(created).findByText("Summer Smith")).toBeInTheDocument();
    });

    it("closes the modal without creating a card", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(column("To Do")).getByRole("button", { name: "Add" }));

      await user.click(screen.getByRole("button", { name: "Close" }));

      expect(screen.queryByRole("dialog")).toBeNull();
      expect(within(column("To Do")).getAllByRole("article")).toHaveLength(2);
    });
  });

  describe("editing a task", () => {
    it("opens the Edit task modal filled in with the task", async () => {
      const user = userEvent.setup();
      renderBoard();

      await user.click(within(card("Fix the portal gun")).getByRole("button", { name: "Edit" }));

      const dialog = screen.getByRole("dialog", { name: "Edit task" });
      expect(within(dialog).getByLabelText("Title")).toHaveValue("Fix the portal gun");
      expect(within(dialog).getByLabelText("Description")).toHaveValue(
        "It's leaking again. Use the plumbus. Don't tell Morty.",
      );
      expect(await within(dialog).findByRole("checkbox", { name: /rick sanchez/i })).toBeChecked();
      expect(within(dialog).getByRole("checkbox", { name: /summer smith/i })).not.toBeChecked();
    });

    it("saves changes to the card", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(card("Go to school")).getByRole("button", { name: "Edit" }));
      const dialog = screen.getByRole("dialog", { name: "Edit task" });

      await user.clear(within(dialog).getByLabelText("Title"));
      await user.type(within(dialog).getByLabelText("Title"), "Skip school");
      await user.click(await within(dialog).findByRole("checkbox", { name: /rick sanchez/i }));
      await user.click(within(dialog).getByRole("button", { name: "Save" }));

      expect(screen.queryByRole("dialog")).toBeNull();
      const edited = within(column("To Do")).getByRole("article", { name: "Skip school" });
      expect(await within(edited).findByText("Rick Sanchez")).toBeInTheDocument();
      expect(within(edited).getByText("Morty Smith")).toBeInTheDocument();
    });
  });

  describe("viewing a task", () => {
    it("opens the task's full contents from its title", async () => {
      const user = userEvent.setup();
      renderBoard();

      await user.click(within(card("Fix the portal gun")).getByRole("button", { name: "Fix the portal gun" }));

      const dialog = screen.getByRole("dialog", { name: "Fix the portal gun" });
      expect(
        within(dialog).getByText("It's leaking again. Use the plumbus. Don't tell Morty."),
      ).toBeInTheDocument();
      expect(within(dialog).getByText("To Do")).toBeInTheDocument();
      expect(await within(dialog).findByText("Rick Sanchez")).toBeInTheDocument();
      expect(await within(dialog).findByText("Morty Smith")).toBeInTheDocument();
    });

    it("opens the task when clicking anywhere else on the card", async () => {
      const user = userEvent.setup();
      renderBoard();

      await user.click(within(card("Fix the portal gun")).getByText(/it's leaking again/i));

      expect(screen.getByRole("dialog", { name: "Fix the portal gun" })).toBeInTheDocument();
    });

    it("does not open the task when a card button is clicked", async () => {
      const user = userEvent.setup();
      renderBoard();

      await user.click(within(card("Go to school")).getByRole("button", { name: "Edit" }));

      expect(screen.getAllByRole("dialog")).toHaveLength(1);
      expect(screen.getByRole("dialog", { name: "Edit task" })).toBeInTheDocument();
    });

    it("does not open the task when its Move to menu is used", async () => {
      const user = userEvent.setup();
      renderBoard();

      await user.click(
        within(card("Go to school")).getByRole("combobox", { name: /move to/i }),
      );

      expect(screen.queryByRole("dialog")).toBeNull();
    });

    it("does not switch to viewing when clicking inside another modal", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(card("Go to school")).getByRole("button", { name: "Edit" }));

      await user.click(
        within(screen.getByRole("dialog", { name: "Edit task" })).getByRole("heading", {
          name: "Edit task",
        }),
      );

      expect(screen.getByRole("dialog", { name: "Edit task" })).toBeInTheDocument();
      expect(screen.queryByRole("dialog", { name: "Go to school" })).toBeNull();
    });

    it("switches to editing from the view modal", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(card("Go to school")).getByRole("button", { name: "Go to school" }));

      await user.click(
        within(screen.getByRole("dialog", { name: "Go to school" })).getByRole("button", { name: "Edit" }),
      );

      expect(screen.getByRole("dialog", { name: "Edit task" })).toBeInTheDocument();
      expect(screen.queryByRole("dialog", { name: "Go to school" })).toBeNull();
    });
  });

  describe("deleting a task", () => {
    it("asks for confirmation before deleting", async () => {
      const user = userEvent.setup();
      renderBoard();

      await user.click(within(card("Go to school")).getByRole("button", { name: "Delete" }));

      expect(screen.getByRole("dialog", { name: "Delete task?" })).toHaveTextContent("Go to school");
      expect(card("Go to school")).toBeInTheDocument();
    });

    it("keeps the card when cancelled", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(card("Go to school")).getByRole("button", { name: "Delete" }));

      await user.click(screen.getByRole("button", { name: "Cancel" }));

      expect(screen.queryByRole("dialog")).toBeNull();
      expect(card("Go to school")).toBeInTheDocument();
    });

    it("removes the card when confirmed", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(card("Go to school")).getByRole("button", { name: "Delete" }));

      await user.click(
        within(screen.getByRole("dialog", { name: "Delete task?" })).getByRole("button", {
          name: "Delete",
        }),
      );

      expect(screen.queryByRole("dialog")).toBeNull();
      expect(screen.queryByRole("article", { name: "Go to school" })).toBeNull();
      expect(within(column("To Do")).getAllByRole("article")).toHaveLength(1);
    });

    it("can be deleted from the view modal", async () => {
      const user = userEvent.setup();
      renderBoard();
      await user.click(within(card("Go to school")).getByRole("button", { name: "Go to school" }));

      await user.click(
        within(screen.getByRole("dialog", { name: "Go to school" })).getByRole("button", {
          name: "Delete",
        }),
      );
      await user.click(
        within(screen.getByRole("dialog", { name: "Delete task?" })).getByRole("button", {
          name: "Delete",
        }),
      );

      expect(screen.queryByRole("article", { name: "Go to school" })).toBeNull();
    });
  });
});
