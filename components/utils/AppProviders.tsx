"use client";

import { useState, type ReactNode } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { RelayEnvironmentProvider } from "react-relay";
import { createRelayEnvironment } from "@/utils/relay/createRelayEnvironment";
import BoardProvider from "./BoardProvider";

/**
 * Client-side providers. They can't live in the (server) page: the Relay
 * environment and the react-dnd backend aren't serializable props.
 */
export default function AppProviders({ children }: { children: ReactNode }) {
  // Lazy initial state gives one environment per mounted app.
  const [environment] = useState(createRelayEnvironment);

  return (
    <RelayEnvironmentProvider environment={environment}>
      <BoardProvider>
        <DndProvider backend={HTML5Backend}>{children}</DndProvider>
      </BoardProvider>
    </RelayEnvironmentProvider>
  );
}
