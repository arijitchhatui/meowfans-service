import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityMaker {
  public static async fromRawToEntityType<T>({
    rawQueryMap,
    mappers,
  }: {
    rawQueryMap: Promise<any[]>;
    mappers: { aliasName: string; entityFieldOutputName?: string }[];
  }): Promise<T[]> {
    return (await rawQueryMap).map((rawQuery: Record<string, unknown>) => {
      const newObj = {};

      for (const { aliasName, entityFieldOutputName } of mappers) {
        for (const [prefixedKey, value] of Object.entries(rawQuery)) {
          const hasPrefix = mappers.some(({ aliasName }) => {
            return prefixedKey.startsWith(aliasName);
          });

          let strippedKey = prefixedKey;

          if (prefixedKey.startsWith(aliasName)) {
            strippedKey = prefixedKey
              .slice(aliasName.length + 1)
              .replace(/_([a-z])/g, (_, character) => character.toUpperCase());

            if (entityFieldOutputName) {
              const propKey = entityFieldOutputName;
              newObj[propKey] ??= {};
              newObj[propKey][strippedKey] = value;
            } else {
              newObj[strippedKey] = value;
            }
          } else if (!hasPrefix) {
            strippedKey = prefixedKey.replace(/_([a-z])/g, (_, character) => character.toUpperCase());
            newObj[strippedKey] = value;
          }
        }
      }
      return newObj;
    }) as T[];
  }
}
