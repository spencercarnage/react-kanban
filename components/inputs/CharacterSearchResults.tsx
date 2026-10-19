"use client";

import { graphql, useLazyLoadQuery } from "react-relay";
import type { CharacterSearchResultsQuery } from "@/__generated__/CharacterSearchResultsQuery.graphql";
import { hasId } from "@/utils/relay/hasId";
import CharacterOption from "./CharacterOption";

type CharacterSearchResultsProps = {
  name: string;
  /** Selected character ids. */
  value: string[];
  onToggle: (characterId: string) => void;
};

export default function CharacterSearchResults({
  name,
  value,
  onToggle,
}: CharacterSearchResultsProps) {
  const data = useLazyLoadQuery<CharacterSearchResultsQuery>(
    graphql`
      query CharacterSearchResultsQuery($name: String) {
        characters(page: 1, filter: { name: $name }) {
          info {
            count
          }
          results {
            id
            ...CharacterOption_character
          }
        }
      }
    `,
    { name },
  );

  const results = (data.characters?.results ?? []).filter(hasId);
  const total = data.characters?.info?.count ?? 0;

  if (results.length === 0) {
    return <p className="py-4 text-center text-sm text-zinc-500">No characters match.</p>;
  }

  return (
    <div className="flex flex-col gap-1">
      <ul className="relative flex max-h-56 flex-col gap-1 overflow-y-auto pr-1">
        {results.map((result) => (
          <li key={result.id}>
            <CharacterOption
              character={result}
              checked={value.includes(result.id)}
              onToggle={() => onToggle(result.id)}
            />
          </li>
        ))}
      </ul>
      {total > results.length && (
        <p className="text-xs text-zinc-500">
          Showing {results.length} of {total}. Search to narrow it down.
        </p>
      )}
    </div>
  );
}
