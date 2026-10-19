export default function CharacterBadgeSkeleton() {
  return (
    <div className="flex animate-pulse items-center gap-2" aria-hidden>
      <div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-700" />
      <div className="flex flex-col gap-1">
        <div className="h-3 w-24 rounded bg-zinc-200 dark:bg-zinc-700" />
        <div className="h-2 w-16 rounded bg-zinc-200 dark:bg-zinc-700" />
      </div>
    </div>
  );
}
