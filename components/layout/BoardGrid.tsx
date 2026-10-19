import type { ReactNode } from "react";

export default function BoardGrid({ children }: { children: ReactNode }) {
  return <div className="grid items-start gap-4 md:grid-cols-3">{children}</div>;
}
