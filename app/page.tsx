import { Suspense } from "react";
import Board from "@/components/display/Board";
import BoardSkeleton from "@/components/display/BoardSkeleton";
import AppHeader from "@/components/navigation/AppHeader";
import AppProviders from "@/components/utils/AppProviders";

export default function Home() {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col gap-6 px-4 py-6 sm:px-6 lg:py-10">
      <AppHeader />
      {/* BoardProvider is browser-only, so the prerendered HTML is this fallback. */}
      <Suspense fallback={<BoardSkeleton />}>
        <AppProviders>
          <main>
            <Board />
          </main>
        </AppProviders>
      </Suspense>
    </div>
  );
}
