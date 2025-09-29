import { Inject, Injectable, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { filter, fromEvent, Observable } from 'rxjs';
import { EventTypes } from '../../util/constants';
import { ProviderTokens } from '../../util/enums';

@Injectable()
export class SSEService {
  private logger = new Logger(SSEService.name);

  constructor(
    @Inject(ProviderTokens.REDIS_PUB_TOKEN) private readonly publisher: Redis,
    @Inject(ProviderTokens.REDIS_SUB_TOKEN) private readonly subscriber: Redis,
  ) {}

  public async subscribe(): Promise<Observable<string>> {
    await this.subscriber.subscribe(EventTypes.VaultDownload);

    return fromEvent(this.subscriber, 'message', (channel, message) => {
      return channel === EventTypes.VaultDownload ? message : null;
    }).pipe(filter((message): message is string => message !== null));
  }

  public async publish(creatorId: string, data: Record<string, unknown>) {
    try {
      await this.publisher.publish(EventTypes.VaultDownload, JSON.stringify({ creatorId, data }));
    } catch {
      this.logger.error('error streaming');
    }
  }
}
