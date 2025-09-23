import { registerEnumType } from '@nestjs/graphql';

export enum HostNames {
  COOMER = 'coomer.st',
  WALLHAVEN = 'wallhaven.cc',
}

registerEnumType(HostNames, { name: 'HostNames' });
