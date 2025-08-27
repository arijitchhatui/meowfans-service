import { ConfigService } from '@nestjs/config';
import * as Sentry from '@sentry/nestjs';
import { httpIntegration, rewriteFramesIntegration } from '@sentry/nestjs';

export const SentryClientService = (configService: ConfigService) => {
  Sentry.init({
    dsn: configService.getOrThrow('SENTRY_DSN'),
    sendDefaultPii: true,
    serverName: configService.getOrThrow('SENTRY_SERVER_NAME'),
    environment: configService.getOrThrow('NODE_ENV') ?? 'development',
    tracesSampleRate: 0,
    beforeSend(event) {
      if (event.exception && event.exception.values && event.exception.values.length > 0) {
        return event;
      }
      return null;
    },
    integrations: [
      rewriteFramesIntegration({
        iteratee(frame) {
          if (frame.filename) {
            const filename = frame.filename.replace(process.cwd(), '');
            frame.filename = filename.replace(/\\/g, '/');
          }
          return frame;
        },
      }),
      httpIntegration({ breadcrumbs: false }),
    ],
  });
};
