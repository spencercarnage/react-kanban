import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// relay-test-utils' createMockEnvironment calls `jest.fn()` internally.
Object.assign(globalThis, { jest: vi });

afterEach(() => {
  cleanup();
  window.localStorage.clear();
});
