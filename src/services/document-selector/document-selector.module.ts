import { Module } from '@nestjs/common';
import { DocumentSelectorService } from './document-selector.service';

@Module({
  providers: [DocumentSelectorService],
  exports: [DocumentSelectorService],
})
export class DocumentSelectorModule {}
