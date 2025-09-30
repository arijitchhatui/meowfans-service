import { Controller, Sse } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { SSEService } from './sse.service';

@Controller({ path: '/sse' })
export class SSEController {
  constructor(private readonly sseService: SSEService) {}

  @Sse('/stream')
  public async subscribe(): Promise<Observable<{ type: string; data: string }>> {
    return (await this.sseService.subscribe()).pipe(
      map(({ type, data }) => ({
        type,
        data,
      })),
    );
  }
}
