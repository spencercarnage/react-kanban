"use client";

import BoardGrid from "@/components/layout/BoardGrid";
import { COLUMNS } from "@/utils/board/columns";
import BoardColumn from "./BoardColumn";

export default function Board() {
  return (
    <BoardGrid>
      {COLUMNS.map((column) => (
        <BoardColumn key={column.id} columnId={column.id} title={column.title} />
      ))}
    </BoardGrid>
  );
}
