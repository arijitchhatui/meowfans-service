import { Controller, Sse } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SSEService } from './sse.service';

@Controller({ path: '/sse' })
export class SSEController {
  constructor(private readonly sseService: SSEService) {}

  @Sse('/download/stream')
  public async subscribe(): Promise<Observable<string>> {
    return await this.sseService.subscribe();
  }
}
