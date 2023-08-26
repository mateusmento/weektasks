import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);
  app.enableCors({ origin: config.CORS_ORIGINS, credentials: true });
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));
  app.use(cookieParser(config.COOKIE_SECRET));
  await app.listen(config.APP_PORT);
}

bootstrap();
