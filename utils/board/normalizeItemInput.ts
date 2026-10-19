import type { ItemInput } from "./types";

export function normalizeItemInput({ title, description, characterIds }: ItemInput): ItemInput {
  return { title: title.trim(), description: description.trim(), characterIds };
}
