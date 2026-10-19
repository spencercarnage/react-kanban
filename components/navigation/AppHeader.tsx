export default function AppHeader() {
  return (
    <header className="flex flex-col gap-1">
      <p className="text-sm font-medium uppercase tracking-widest text-lime-600 dark:text-lime-400">
        Interdimensional task tracking
      </p>
      <h1 className="text-3xl font-bold tracking-tight">Rick &amp; Morty Kanban</h1>
      <p className="text-zinc-600 dark:text-zinc-400">
        Add tasks to To Do, assign characters, and drag them through Doing to Done.
      </p>
    </header>
  );
}
