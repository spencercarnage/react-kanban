"use client";

import classNames from "classnames";
import Image from "next/image";
import { graphql, useFragment } from "react-relay";
import type { CharacterOption_character$key } from "@/__generated__/CharacterOption_character.graphql";
import CharacterStatus from "@/components/display/CharacterStatus";

type CharacterOptionProps = {
  character: CharacterOption_character$key;
  checked: boolean;
  onToggle: () => void;
};

export default function CharacterOption({ character, checked, onToggle }: CharacterOptionProps) {
  const data = useFragment(
    graphql`
      fragment CharacterOption_character on Character {
        name
        image
        ...CharacterStatus_character
      }
    `,
    character,
  );

  return (
    <label
      className={classNames(
        "flex cursor-pointer items-center gap-3 rounded-lg border p-2 text-sm transition-colors has-focus-visible:outline-2 has-focus-visible:outline-lime-500",
        checked
          ? "border-lime-400 bg-lime-50 dark:bg-lime-950/30"
          : "border-transparent hover:bg-zinc-100 dark:hover:bg-zinc-800",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onToggle}
        className="sr-only"
      />
      {data.image && (
        <Image
          src={data.image}
          alt=""
          width={32}
          height={32}
          className="size-8 rounded-full object-cover"
        />
      )}
      <span className="min-w-0">
        <span className="block truncate font-medium">{data.name}</span>
        <CharacterStatus character={data} />
      </span>
    </label>
  );
}
