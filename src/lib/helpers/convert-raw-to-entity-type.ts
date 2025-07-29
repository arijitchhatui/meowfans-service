/**
 * @param query takes query result of getRawMany method
 * @param stripper is an array of string which takes the alias like user, creator_blocks etc.
 * @param parameters is an array of object consists of name and prefix which matches the new alias name and prefix to match the stripper match
 * @returns returns with all deleted _fields and in camelCase
 */

export async function convertRawToEntityType<T>(
  query: Promise<any[]>,
  stripper?: { aliases: Array<string> },
  parameters?: [{ name: string; prefix: string }],
): Promise<T[]> {
  return (await query).map((d: Record<string, unknown>) =>
    Object.entries(d).reduce<Partial<T>>((acc, [key, value]) => {
      let strippedKey = key;

      if (stripper) {
        stripper.aliases.map((alias) => {
          if (key.startsWith(alias + '_')) strippedKey = key.slice(alias.length + 1);
        });
      }

      const newKey = strippedKey.replace(/_([a-z])/g, (_, character) => character.toUpperCase());

      if (parameters?.length) {
        parameters.map((parameter) => {
          if (key.startsWith(parameter.prefix + '_')) {
            acc[parameter.name] ??= {};
            acc[parameter.name][newKey] = value;
          } else {
            acc[newKey] = value;
          }
        });
      } else {
        acc[newKey] = value;
      }

      return acc;
    }, {}),
  ) as T[];
}
