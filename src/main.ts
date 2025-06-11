import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  const logger = new Logger(AppModule.name);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  const configService = app.get(ConfigService);
  const port: number = configService.get<number>('PORT')!;
  const builder = new DocumentBuilder().addTag('auth').build();
  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('/', app, document);

  await app.listen(port);
  logger.log(`Server is listening on host http://localhost:${port}`);
}
bootstrap();
