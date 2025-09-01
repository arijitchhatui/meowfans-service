import './sentry.client.service';

import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { useContainer } from 'class-validator';
import { AppModule } from './app.module';
import { SentryClientService } from './sentry.client.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.enableCors();
  const logger = new Logger(AppModule.name);

  SentryClientService(configService);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const port: number = configService.get<number>('PORT')!;
  const builder = new DocumentBuilder().addTag('auth').build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('/doc', app, document);

  await app.listen(port);
  logger.log(`Server is listening on host http://localhost:${port}`);
}
bootstrap();
