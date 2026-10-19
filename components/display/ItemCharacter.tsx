"use client";

import { graphql, useLazyLoadQuery } from "react-relay";
import type { ItemCharacterQuery } from "@/__generated__/ItemCharacterQuery.graphql";
import CharacterBadge from "./CharacterBadge";
import CharacterUnavailable from "./CharacterUnavailable";

/**
 * Loads one character by id. `store-or-network` plus the `character` missing
 * field handler means characters already loaded by the search render instantly.
 */
export default function ItemCharacter({ characterId }: { characterId: string }) {
  const data = useLazyLoadQuery<ItemCharacterQuery>(
    graphql`
      query ItemCharacterQuery($id: ID!) {
        character(id: $id) {
          ...CharacterBadge_character
        }
      }
    `,
    { id: characterId },
    { fetchPolicy: "store-or-network" },
  );

  if (!data.character) return <CharacterUnavailable />;

  return <CharacterBadge character={data.character} />;
}
