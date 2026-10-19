// Downloads the Rick and Morty GraphQL schema for relay-compiler.
// Usage: npm run relay:schema
import { writeFile } from "node:fs/promises";
import { buildClientSchema, getIntrospectionQuery, printSchema } from "graphql";

const ENDPOINT = "https://rickandmortyapi.com/graphql";

const response = await fetch(ENDPOINT, {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ query: getIntrospectionQuery() }),
});

if (!response.ok) {
  throw new Error(`Schema request failed: ${response.status}`);
}

const { data } = await response.json();
await writeFile("schema.graphql", printSchema(buildClientSchema(data)) + "\n");
console.log("Wrote schema.graphql");
