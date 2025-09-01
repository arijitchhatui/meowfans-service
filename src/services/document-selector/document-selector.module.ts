import { Module } from '@nestjs/common';
import { DocumentSelectorService } from './document-selector.service';

@Module({
  providers: [DocumentSelectorService],
})
export class DocumentSelectorModule {}
