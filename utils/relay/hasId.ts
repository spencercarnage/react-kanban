/** Narrows a nullable GraphQL list entry to one that has an id. */
export function hasId<T extends { readonly id?: string | null }>(
  value: T | null | undefined,
): value is T & { readonly id: string } {
  return value?.id != null;
}
