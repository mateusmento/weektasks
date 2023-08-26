import { INestApplication } from '@nestjs/common';
import { IoAdapter } from '@nestjs/platform-socket.io';

export class RedisSocketIoAdapter extends IoAdapter {
  constructor(app: INestApplication) {
    super(app);
  }
}
