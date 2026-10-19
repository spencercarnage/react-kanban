import type { FetchFunction } from "relay-runtime";

export const GRAPHQL_ENDPOINT = "https://rickandmortyapi.com/graphql";

export const fetchGraphQL: FetchFunction = async (operation, variables) => {
  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: operation.text, variables }),
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  return response.json();
};
