import { Injectable } from '@nestjs/common';

@Injectable()
export class EntityBuilder {
  public async toEntityType<T>(rawData: Promise<any[]>, stripper?: { aliases: Array<string> }): Promise<T[]> {
    return (await rawData).map((d: Record<string, unknown>) =>
      Object.entries(d).reduce<Partial<T>>((acc, [key, value]) => {
        let strippedKey = key;

        if (stripper) {
          stripper.aliases.map((alias) => {
            if (key.startsWith(alias + '_')) {
              strippedKey = key.slice(alias.length + 1);
            }
          });
        }

        const newKey = strippedKey.replace(/_([a-z])/g, (_, character) => character.toUpperCase());
        acc[newKey] = value;
        return acc;
      }, {}),
    ) as T[];
  }
}
