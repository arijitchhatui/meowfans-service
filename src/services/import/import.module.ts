import { HasSubdirectoryForBranch } from '@app/validators';
import { Global, Module } from '@nestjs/common';
import { DocumentSelectorService } from '../document-selector/document-selector.service';
import { VaultsModule } from '../vaults';
import { ImportService } from './import.service';

@Global()
@Module({
  imports: [VaultsModule],
  providers: [ImportService, DocumentSelectorService, HasSubdirectoryForBranch],
  exports: [ImportService],
})
export class ImportModule {}
