import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { fromEvent, Observable } from 'rxjs';
import { EventTypes, ProviderTokens } from '../../util/enums';

@Injectable()
export class SSEService {
  private logger = new Logger(SSEService.name);

  constructor(
    @Inject(ProviderTokens.REDIS_PUB_TOKEN) private readonly publisher: Redis,
    @Inject(ProviderTokens.REDIS_SUB_TOKEN) private readonly subscriber: Redis,
  ) {}

  public async subscribe(): Promise<Observable<{ type: string; data: string }>> {
    await this.subscriber.subscribe(
      EventTypes.VaultDownload,
      EventTypes.VaultDownload,
      EventTypes.ImportCompleted,
      EventTypes.VaultDownloadCompleted,
      EventTypes.ImportObject,
    );

    return fromEvent(this.subscriber, 'message', (channel: string, message: string) => {
      return { type: channel, data: message };
    });
  }

  public async publish(creatorId: string, data: Record<string, unknown>, type: EventTypes) {
    try {
      await this.publisher.publish(type, JSON.stringify({ creatorId, data }));
    } catch {
      this.logger.error('error streaming');
    }
  }
}
