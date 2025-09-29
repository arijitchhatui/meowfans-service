import { registerEnumType } from '@nestjs/graphql';

export enum EventTypes {
  VaultDownload = 'vault_download',
}
registerEnumType(EventTypes, { name: 'EventTypes' });
