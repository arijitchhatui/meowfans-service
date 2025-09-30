import { registerEnumType } from '@nestjs/graphql';

export enum EventTypes {
  VaultDownload = 'vault_download',
  ImportObject = 'import_object',
  VaultDownloadCompleted = 'vault_download_completed',
  ImportCompleted = 'import_completed',
}
registerEnumType(EventTypes, { name: 'EventTypes' });
