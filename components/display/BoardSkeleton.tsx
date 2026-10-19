import BoardGrid from "@/components/layout/BoardGrid";

export default function BoardSkeleton() {
  return (
    <div className="animate-pulse" aria-busy>
      <BoardGrid>
        {["todo", "doing", "done"].map((column) => (
          <div key={column} className="h-64 rounded-2xl bg-zinc-200 dark:bg-zinc-800" />
        ))}
      </BoardGrid>
    </div>
  );
}
