import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app_a = await NestFactory.create(AppModule);
  await app_a.listen(3000);
}
bootstrap();
