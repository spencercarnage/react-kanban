# Relay conventions

Relay fetches all GraphQL data from <https://rickandmortyapi.com/graphql>,
in the browser only. Nothing is fetched or rendered with data on the
server. `BoardProvider` calls `use(browser())` under the `<Suspense>` in
`app/page.tsx`, so every query root renders only in the browser and the
prerendered HTML is the skeleton.

## Co-location and fragmentRefs

- Each component declares the data it renders in its own `graphql`
  fragment, in its own file.
- Components never receive raw GraphQL data as props. They take a fragment
  ref (`character: CharacterBadge_character$key`) and read it with
  `useFragment`.
- Only query roots (`ItemCharacter`, `SelectedAssignee`,
  `CharacterSearchResults`) call `useLazyLoadQuery`. They pass fragment
  refs down.
- Don't select fields a component doesn't render. If two components show
  the same thing, extract a shared fragment component (`CharacterStatus`)
  and have both spread it.
- Relay naming rules: queries are `<FileName>Query`, and fragments are
  `<FileName>_<propName>`.

## Environment (`utils/relay/`)

- `components/utils/AppProviders.tsx` creates the environment once with
  `useState(createRelayEnvironment)`.

- `getDataID` prefixes ids with the typename. Rick and Morty ids are only
  unique per type, and Relay normalizes by id.
- `missingFieldHandlers` resolve `character(id:)` from records already in
  the store. With `fetchPolicy: "store-or-network"`, a card whose character
  was loaded by the search renders without a request.

## Workflow

- `npm run relay` compiles artifacts into `__generated__/`. They are not
  committed (only `.gitkeep` is, because relay-compiler needs the folder),
  so every script that needs them (`dev`, `build`, `test`, `test:run`,
  `typecheck`) runs `npm run relay` first. Any new script that builds,
  runs, type-checks, or tests the app must do the same.
- `noSourceControl` in `relay.config.json` stops relay-compiler from
  running `git add` on the files it writes.
- `dev` compiles once at startup. Run `npm run relay:watch` alongside it
  while editing queries or fragments.
- `npm run relay:schema` re-downloads `schema.graphql`.
- Next compiles `graphql` tags with `compiler.relay` in `next.config.ts`.
  Vitest does the same with `babel-plugin-relay` in `vitest.config.mts`.
  Keep both in sync with `relay.config.json`.
- Wrap every query root in `<Suspense>` and an `ErrorBoundary`.
