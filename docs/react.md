# React conventions

## Components

- One component per file, default-exported, in the right `components/`
  subfolder (see [project-structure.md](project-structure.md)).
- A thin wrapper (one that only adds markup, styles, or providers around
  `children`) has to earn its file by being used in more than one place
  (`BoardGrid`, `FieldError`). If it's used once, inline its markup where
  it's used. The exception is a client boundary: a Server Component can't
  pass non-serializable props (like the Relay environment), so providers
  that need them go in a `"use client"` component such as `AppProviders`.
- Add `"use client"` only to components that use hooks, context, or browser
  APIs. Keep `app/page.tsx` a Server Component.
- React 19 passes `ref` as a normal prop. Don't use `forwardRef`.

## State

- Derive values instead of storing them. If a value can be computed from
  props, context, or other state, compute it during render
  (`const celebrating = celebratingItemId === itemId`).
- Change state in event handlers (`onChange`, `onSubmit`, drag/drop
  callbacks, `onAnimationEnd`), not in response to renders.
- Use `useEffect` only to sync with an external system when nothing else
  works. Reach for these first:
  - Write side effects (like persistence) in the event or `dispatch` that
    causes them.
  - Read initial state from outside React with a lazy `useState` or
    `useReducer` initializer.
  - End timed UI on its own event (`onAnimationEnd`) rather than a timer.
  - Attach DOM APIs and library connectors (react-dnd, `showModal()`) in a
    callback ref.
  - Reset a subtree with a `key`.
- Browser-only components call `use(browser(reason))` from `react-dom` (see
  `BoardProvider`) and sit under a `<Suspense>`. Its fallback becomes the
  prerendered HTML.
- Use `useDeferredValue` for "search as you type" so old results stay on
  screen while new ones load.

## Board state

- Change the board only by dispatching an action to
  `utils/board/boardReducer.ts`. Add a hook in `hooks/board/` for each user
  action. Each one dispatches exactly one action.
- Read board state through those hooks, never through the contexts
  directly.
- Don't write to `localStorage` yourself. `BoardProvider` persists inside
  `dispatch`.
- The storage key (`react-kanban:board`) is not versioned, and old data is
  not migrated. The project is early, so if a change alters the saved
  board's shape, call it out so the saved board can be cleared by hand.

## Modals

- Use `components/layout/Modal` (a native `<dialog>`). Render it to open it
  and unmount it to close it.
- The component that owns a modal's trigger keeps its open state. When it
  owns several modals, use a single union state
  (`useState<"view" | "edit" | null>`) instead of one boolean per modal, so
  only one can be open.
- `Modal` portals to `<body>`, but React still bubbles its events through
  the component tree. So a click handler on an element that renders a
  modal must ignore clicks from outside its own DOM
  (`event.currentTarget.contains(event.target)`).

## Forms

- Create and edit a record with the same form, configured by props
  (`defaultValues`, `submitLabel`, `onSubmit`), as `ItemForm` does. Don't
  add a separate edit form.
- Forms use `react-hook-form`. Plain inputs take `{...register("field")}`.
  Custom inputs (like `CharacterPicker`) are wrapped in `<Controller>` and
  take `value`, `onChange`, and `error` props.
- Validation messages render through `FieldError` (`role="alert"`), and the
  input is linked to it with `aria-describedby`.

## Accessibility

- Every drag interaction needs a non-drag alternative (cards have a "Move
  to" select).
- A clickable container (like a card) ignores clicks that land on its
  controls, and still has a real `<button>` inside so keyboard and
  screen-reader users can do the same thing. Browsers fire no click after
  a drag, so a draggable container needs no extra guard.
- Columns are labelled `<section>` regions and cards are labelled
  `<article>`s. Tests query by those roles, so keep them.
- Respect `prefers-reduced-motion` with Tailwind's `motion-safe:` /
  `motion-reduce:` variants.

## Styling

- Tailwind only. Combine conditional classes with `classnames`.
- Make every scroll container (`overflow-auto`, `overflow-y-auto`, …)
  `relative`. It only clips absolutely positioned descendants (including
  every `sr-only` element) that are positioned inside it. Otherwise they
  stretch the scroll area of an outer positioned element, like a modal.
- Custom animations are declared as `--animate-*` with `@keyframes` inside
  `@theme` in `app/globals.css`.
- Tailwind only generates classes it can find as whole strings, so never
  build class names dynamically. Spell out each variant (see `PARTICLES` in
  `Celebration.tsx`).
