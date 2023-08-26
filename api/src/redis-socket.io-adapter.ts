import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { AppConfig } from './app.config';
import { RedisAdapter, createAdapter } from '@socket.io/redis-adapter';
import { createClient } from 'redis';

export class RedisSocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private config: AppConfig,
    private adapter: (nsp: any) => RedisAdapter
  ) {
    super(app);
  }

  static async create(app: INestApplication, config: AppConfig) {
    const pub = createClient({ url: config.REDIS_URL });
    const sub = pub.duplicate();
    await Promise.all([pub.connect(), sub.connect()]);
    const redisAdapter = createAdapter(pub, sub);
    return new RedisSocketIoAdapter(app, config, redisAdapter);
  }

  createIOServer(port: number, options?: any) {
    const server: Server = super.createIOServer(port, {
      ...options,
      cors: {
        origin: this.config.CORS_ORIGINS,
        credentials: true,
      },
    } as ServerOptions);
    server.use(this.adapter);
    return server;
  }
}
