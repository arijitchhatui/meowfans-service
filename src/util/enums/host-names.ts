import { registerEnumType } from '@nestjs/graphql';

export enum HostNames {
  COOMER = 'coomer.st',
  KEMONO = 'kemono.cr',
  WALLHAVEN = 'wallhaven.cc',
}

registerEnumType(HostNames, { name: 'HostNames' });
