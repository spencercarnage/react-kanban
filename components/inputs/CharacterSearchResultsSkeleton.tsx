import CharacterBadgeSkeleton from "@/components/display/CharacterBadgeSkeleton";

export default function CharacterSearchResultsSkeleton() {
  return (
    <div className="flex flex-col gap-3 p-2" aria-busy>
      {[0, 1, 2, 3].map((index) => (
        <CharacterBadgeSkeleton key={index} />
      ))}
    </div>
  );
}
