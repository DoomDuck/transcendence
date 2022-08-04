import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { INestApplication } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '../..', 'public'), {
    prefix: '/public',
  });
  app.useStaticAssets(join(__dirname, '../..', 'build'), { prefix: '/build' });
  await app.listen(5000);
}
bootstrap();
