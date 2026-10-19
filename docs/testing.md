# Testing conventions

Vitest, React Testing Library, `@testing-library/user-event`, `jest-dom`,
and `relay-test-utils`. Run with `npm test` (watch) or `npm run test:run`.

## Process

- Red first. Write the test, run it, and watch it fail for the right reason
  before writing the code.
- Never edit a test just to make it pass. If a test is wrong, say why and
  fix the test as its own change.
- Agree on the seam (the public interface under test) before writing tests.
  Current seams:
  - `utils/board/*`: pure move and reorder functions.
  - `hooks/board/*`: board hooks, rendered against a real `BoardProvider`
    (`renderBoardHooks`).
  - `components/display/Board`: columns, cards (description preview,
    assignees), the "Move to" menu, the celebration, and the Add, Edit, and
    View modals.
- Ask before adding tests for a new hook. If a hook needs tests, give it
  its own file.
- Test behavior through the public interface: roles, labels, and visible
  text. Don't test internals or call counts.

## React

- Test click and change events with `userEvent`, and assert on what renders
  afterward.
- Seed the board with `<BoardProvider initialBoard={...}>` instead of
  writing to `localStorage`.
- `localStorage` is cleared after every test (`vitest.setup.ts`).
- Real drag gestures aren't simulated in jsdom. Test the same paths through
  the "Move to" select and the `useMoveItem` preview and drop functions.
- `vitest.polyfills.ts` adds `HTMLDialogElement.showModal()` and `close()`,
  which jsdom lacks. Query open modals with
  `screen.getByRole("dialog", { name })`. They're portaled, so they aren't
  `within` the card.
- `vitest.polyfills.ts` also defines `AnimationEvent`. Without it, React
  listens for `webkitAnimationEnd` and `fireEvent.animationEnd` does
  nothing.

## Relay

- Use `createMockEnvironment()` inside `<RelayEnvironmentProvider>`.
- Resolve operations with `environment.mock.queueOperationResolver` and
  `MockPayloadGenerator.generate(operation, { Character: () => ({ ... }) })`.
- Each queued resolver answers one request, and the mock removes a used
  resolver by identity. To answer every request, have the resolver queue a
  fresh closure of itself (see `resolveAllOperations` in `Board.test.tsx`)
  and branch on `operation.request.node.params.name`.
- `vitest.setup.ts` aliases `jest` to `vi`, because `relay-test-utils`
  calls `jest.fn()`.

## react-hook-form

- Don't `vi.mock("react-hook-form")`. Render the real form and interact
  with it.
- To test an input that calls `useFormContext`, wrap it in a small test
  component that calls `useForm` and renders `<FormProvider>`.
- Assert on validation messages by role (`alert`) and on what the submit
  handler produced (for example, a new card on the board).
