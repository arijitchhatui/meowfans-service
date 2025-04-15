import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const logger = new Logger(AppModule.name);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT') || 9090;

  await app.listen(port);
  logger.log(`Server is listening on ${port}`);
}
bootstrap();
