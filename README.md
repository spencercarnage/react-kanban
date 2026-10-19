# Rick & Morty Kanban

A frontend-only Kanban board (To Do, Doing, Done) where every task is
assigned a character from the
[Rick and Morty GraphQL API](https://rickandmortyapi.com/graphql).

- Add tasks from the **Add** button in To Do. A task has a title, a
  description, and one or more characters picked from a live search. The
  card previews the first two sentences of the description.
- Click a card's title to view the whole task, **Edit** to change it, or
  **Delete** to remove it (after a confirmation). Add and Edit share one
  modal form (react-hook-form).
- Drag cards between columns and reorder them within a column (react-dnd).
  Each card also has a "Move to" menu for keyboard and screen reader users.
- Moving a card into Done sets off a confetti burst and a "Wubba lubba dub
  dub!" (custom Tailwind animation, reduced-motion aware).
- The board is saved to `localStorage`.

## Stack

- [Next.js 16](https://nextjs.org) (App Router, Turbopack)
- [React 19](https://react.dev)
- [TypeScript](https://www.typescriptlang.org)
- [Tailwind CSS 4](https://tailwindcss.com)
- [Relay 21](https://relay.dev) for the GraphQL API
- [react-hook-form](https://react-hook-form.com) for the task form
- [react-dnd](https://react-dnd.github.io/react-dnd) with the HTML5 backend
  for drag and drop
- [classnames](https://github.com/JedWatson/classnames) for conditional
  classes
- [Vitest 5](https://vitest.dev) with jsdom
- [Testing Library](https://testing-library.com) (React, user-event,
  jest-dom)
- [relay-test-utils](https://relay.dev/docs/guides/testing-relay-components/)
  for mocking Relay in tests

## Scripts

```bash
npm install
npm run dev          # relay-compiler, then next dev
npm run test         # relay-compiler, then vitest (watch)
npm run test:run     # single run
npm run build        # relay-compiler, then next build
npm run typecheck    # relay-compiler, then tsc
npm run relay:schema # re-download schema.graphql
```

## Conventions

See [`docs/`](docs). [AGENTS.md](AGENTS.md) says which file to read before
each kind of change.
