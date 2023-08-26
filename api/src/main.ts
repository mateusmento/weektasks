import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppConfig } from './app.config';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { SocketIoAdapter, createRedisAdapter } from './websockets';
import { initializeTransactionalContext } from 'typeorm-transactional';

bootstrap();

async function bootstrap() {
  process.env.TZ = 'America/Sao_Paulo';
  initializeTransactionalContext();

  const app = await NestFactory.create(AppModule);
  const config = app.get(AppConfig);

  app.enableCors({
    origin: config.CORS_ORIGINS,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    })
  );

  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  app.useWebSocketAdapter(
    new SocketIoAdapter(app, {
      cors: {
        origin: config.CORS_ORIGINS,
        credentials: true,
      },
      adapter: await createRedisAdapter({ url: config.REDIS_URL }),
    })
  );

  app.use(cookieParser(config.COOKIE_SECRET));

  app.enableShutdownHooks();
  await app.listen(config.APP_PORT);
}
