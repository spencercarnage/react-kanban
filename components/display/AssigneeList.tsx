import { Suspense } from "react";
import ErrorBoundary from "@/components/utils/ErrorBoundary";
import CharacterBadgeSkeleton from "./CharacterBadgeSkeleton";
import CharacterUnavailable from "./CharacterUnavailable";
import ItemCharacter from "./ItemCharacter";

/** Each assigned character, loaded independently. */
export default function AssigneeList({ characterIds }: { characterIds: string[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {characterIds.map((characterId) => (
        <li key={characterId}>
          <ErrorBoundary fallback={<CharacterUnavailable />}>
            <Suspense fallback={<CharacterBadgeSkeleton />}>
              <ItemCharacter characterId={characterId} />
            </Suspense>
          </ErrorBoundary>
        </li>
      ))}
    </ul>
  );
}
