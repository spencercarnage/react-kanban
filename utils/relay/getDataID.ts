/**
 * Rick and Morty ids are only unique per type (Character "1" and Episode "1"
 * both exist), but Relay normalizes records by id alone. Prefix with the
 * typename so records never collide.
 */
export function getDataID(fieldValue: { [key: string]: unknown }, typeName: string) {
  const id = fieldValue.id;
  return id == null ? undefined : `${typeName}:${String(id)}`;
}
