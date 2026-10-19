"use client";

import classNames from "classnames";
import { Suspense, useDeferredValue, useId, useState } from "react";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import CharacterSearchResults from "./CharacterSearchResults";
import CharacterSearchResultsSkeleton from "./CharacterSearchResultsSkeleton";
import FieldError from "./FieldError";
import SelectedAssignee from "./SelectedAssignee";

type CharacterPickerProps = {
  /** Selected character ids. */
  value: string[];
  onChange: (characterIds: string[]) => void;
  error?: string;
};

/**
 * Searchable multi-select of characters. The query follows a deferred copy of
 * the search text, so old results stay on screen (dimmed) while new ones load
 * instead of flashing the Suspense fallback on every keystroke.
 */
export default function CharacterPicker({ value, onChange, error }: CharacterPickerProps) {
  const searchId = useId();
  const errorId = `${searchId}-error`;
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search.trim());
  const isStale = search.trim() !== deferredSearch;

  function toggle(characterId: string) {
    onChange(
      value.includes(characterId)
        ? value.filter((id) => id !== characterId)
        : [...value, characterId],
    );
  }

  return (
    <fieldset className="flex min-w-0 flex-col gap-2" aria-describedby={error ? errorId : undefined}>
      <legend className="mb-1.5 text-sm font-medium">Assignees</legend>

      {value.length > 0 && (
        <ul className="flex flex-wrap gap-1.5">
          {value.map((characterId) => (
            <li key={characterId}>
              <ErrorBoundary fallback={null}>
                <Suspense fallback={null}>
                  <SelectedAssignee characterId={characterId} onRemove={() => toggle(characterId)} />
                </Suspense>
              </ErrorBoundary>
            </li>
          ))}
        </ul>
      )}

      <label htmlFor={searchId} className="sr-only">
        Search characters
      </label>
      <input
        id={searchId}
        type="search"
        placeholder="Search characters"
        autoComplete="off"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        className={classNames(
          "rounded-lg border bg-white px-3 py-2 text-sm dark:bg-zinc-950",
          error ? "border-red-500" : "border-zinc-300 dark:border-zinc-700",
        )}
      />

      <ErrorBoundary
        resetKey={deferredSearch}
        fallback={
          <p className="text-sm text-red-600">Couldn&apos;t reach the Citadel. Try another search.</p>
        }
      >
        <Suspense fallback={<CharacterSearchResultsSkeleton />}>
          <div className={classNames("transition-opacity", isStale && "opacity-50")}>
            <CharacterSearchResults name={deferredSearch} value={value} onToggle={toggle} />
          </div>
        </Suspense>
      </ErrorBoundary>

      <FieldError id={errorId} message={error} />
    </fieldset>
  );
}
