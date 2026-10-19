import { ROOT_TYPE, type MissingFieldHandler } from "relay-runtime";

/**
 * Lets `character(id: X)` resolve from records that other queries (e.g. the
 * character search) already put in the store, so a newly created card renders
 * its character without a network round trip.
 */
export const missingFieldHandlers: MissingFieldHandler[] = [
  {
    kind: "linked",
    handle(field, record, args) {
      if (
        record?.getType() === ROOT_TYPE &&
        field.name === "character" &&
        args.id != null
      ) {
        return `Character:${String(args.id)}`;
      }
      return undefined;
    },
  },
];
