import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { fetchGraphQL } from "./fetchGraphQL";
import { getDataID } from "./getDataID";
import { missingFieldHandlers } from "./missingFieldHandlers";

export function createRelayEnvironment() {
  return new Environment({
    network: Network.create(fetchGraphQL),
    store: new Store(new RecordSource()),
    getDataID,
    missingFieldHandlers,
  });
}
