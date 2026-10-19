"use client";

import Image from "next/image";
import { graphql, useFragment } from "react-relay";
import type { CharacterBadge_character$key } from "@/__generated__/CharacterBadge_character.graphql";
import CharacterStatus from "./CharacterStatus";

type CharacterBadgeProps = {
  character: CharacterBadge_character$key;
};

export default function CharacterBadge({ character }: CharacterBadgeProps) {
  const data = useFragment(
    graphql`
      fragment CharacterBadge_character on Character {
        name
        image
        ...CharacterStatus_character
      }
    `,
    character,
  );

  return (
    <div className="flex items-center gap-2">
      {data.image && (
        <Image
          src={data.image}
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      )}
      <div className="min-w-0 text-sm">
        <p className="truncate font-medium">{data.name}</p>
        <CharacterStatus character={data} />
      </div>
    </div>
  );
}
