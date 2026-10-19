"use client";

import classNames from "classnames";
import { graphql, useFragment } from "react-relay";
import type { CharacterStatus_character$key } from "@/__generated__/CharacterStatus_character.graphql";

export default function CharacterStatus({ character }: { character: CharacterStatus_character$key }) {
  const data = useFragment(
    graphql`
      fragment CharacterStatus_character on Character {
        status
        species
      }
    `,
    character,
  );

  return (
    <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
      <span
        aria-hidden
        className={classNames("size-1.5 rounded-full", {
          "bg-lime-500": data.status === "Alive",
          "bg-red-500": data.status === "Dead",
          "bg-zinc-400": data.status !== "Alive" && data.status !== "Dead",
        })}
      />
      {data.status} · {data.species}
    </span>
  );
}
