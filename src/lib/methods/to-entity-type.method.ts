import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityBuilder {
  public async toEntityType<T>({
    rawQuery,
    stripper,
    parameters,
  }: {
    rawQuery: Promise<any[]>;
    stripper?: { aliases: Array<string> };
    parameters?: [{ name: string; alias: string }];
  }): Promise<T[]> {
    return (await rawQuery).map((d: Record<string, unknown>) =>
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
            if (key.startsWith(parameter.alias + '_')) {
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
}
