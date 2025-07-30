/**
 * @param query takes query result of getRawMany method
 * @param stripper is an array of string which takes the alias like user, creator_blocks etc.
 * @param parameters is an array of object consists of name and alias which matches the new alias name and prefix to match the stripper match
 * @returns returns with all deleted _fields and in camelCase
 */

/**
 * Converts raw query results into a specified entity type by transforming keys and optionally grouping values.
 *
 * @template T - The type of the entity to which the raw data will be converted.
 * @param query - A promise that resolves to an array of raw data objects.
 * @param stripper - Optional configuration for stripping prefixes from keys. Contains an array of aliases to remove.
 * @param parameters - Optional configuration for grouping keys into nested objects. Each parameter specifies a name and prefix.
 * @returns A promise that resolves to an array of transformed entities of type `T`.
 */

export async function convertRawToEntityType<T>({
  rawData,
  stripper,
  parameters,
}: {
  rawData: Promise<Array<any>>;
  stripper?: { aliases: Array<string> };
  parameters?: Array<{ name: string; alias: string }>;
}): Promise<T[]> {
  return (await rawData).map((raw: Record<string, unknown>) =>
    Object.entries(raw).reduce<Partial<T>>((acc, [rawKey, rawValue]) => {
      let strippedKey = rawKey;

      if (stripper) {
        stripper.aliases.map((alias) => {
          if (rawKey.startsWith(alias + '_')) strippedKey = rawKey.slice(alias.length + 1);
        });
      }

      const newKey = strippedKey.replace(/_([a-z])/g, (_, character) => character.toUpperCase());

      if (parameters?.length) {
        parameters.map((parameter) => {
          if (rawKey.startsWith(parameter.alias + '_')) {
            acc[parameter.name] ??= {};
            acc[parameter.name][newKey] = rawValue;
          } else {
            acc[newKey] = rawValue;
          }
        });
      } else {
        acc[newKey] = rawValue;
      }

      return acc;
    }, {}),
  ) as T[];
}
