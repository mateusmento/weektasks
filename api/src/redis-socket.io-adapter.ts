import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { Server, ServerOptions } from 'socket.io';
import { AppConfig } from './app.config';
import { RedisAdapter } from '@socket.io/redis-adapter';

export class RedisSocketIoAdapter extends IoAdapter {
  constructor(
    app: INestApplication,
    private config: AppConfig,
    private adapter: (nsp: any) => RedisAdapter
  ) {
    super(app);
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
