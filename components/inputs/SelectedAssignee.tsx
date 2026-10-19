"use client";

import Image from "next/image";
import { graphql, useLazyLoadQuery } from "react-relay";
import type { SelectedAssigneeQuery } from "@/__generated__/SelectedAssigneeQuery.graphql";

type SelectedAssigneeProps = {
  characterId: string;
  onRemove: () => void;
};

/** A removable chip for a character picked in the form. */
export default function SelectedAssignee({ characterId, onRemove }: SelectedAssigneeProps) {
  const { character } = useLazyLoadQuery<SelectedAssigneeQuery>(
    graphql`
      query SelectedAssigneeQuery($id: ID!) {
        character(id: $id) {
          name
          image
        }
      }
    `,
    { id: characterId },
    { fetchPolicy: "store-or-network" },
  );
  const name = character?.name ?? "Unknown character";

  return (
    <span className="flex items-center gap-1.5 rounded-full border border-lime-400 bg-lime-50 py-0.5 pl-0.5 pr-1 text-xs font-medium dark:bg-lime-950/30">
      {character?.image && (
        <Image
          src={character.image}
          alt=""
          width={20}
          height={20}
          className="size-5 rounded-full object-cover"
        />
      )}
      {name}
      <button
        type="button"
        aria-label={`Remove ${name}`}
        onClick={onRemove}
        className="rounded-full px-1 text-zinc-500 hover:bg-lime-200 hover:text-zinc-900 dark:hover:bg-lime-900"
      >
        ×
      </button>
    </span>
  );
}
