/**
 *
 * @param query takes query result of getRawMany method
 * @param stripper is an array of string which takes the prefix like user, creator_blocks etc.
 * @returns returns with all deleted _fields and in camelCase
 */

export async function convertRawToEntityType<T>(
  query: Promise<any[]>,
  stripper?: { prefixes: Array<string> },
): Promise<T[]> {
  return (await query).map((d: Record<string, unknown>) =>
    Object.entries(d).reduce<Partial<T>>((acc, [key, value]) => {
      let strippedKey = key;

      if (stripper) {
        stripper.prefixes.map((prefix) => {
          if (key.startsWith(prefix + '_')) strippedKey = key.slice(prefix.length + 1);
        });
      }

      const newKey = strippedKey.replace(/_([a-z])/g, (_, character) => character.toUpperCase());
      acc[newKey] = value;
      return acc;
    }, {}),
  ) as T[];
}
