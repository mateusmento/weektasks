import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  constructor(private config = new ConfigService()) {}

  get APP_PORT(): number {
    return this.config.get('APP_PORT');
  }

  get CORS_ORIGINS(): string[] {
    return this.config
      .get('CORS_ORIGINS')
      .split(',')
      .map((url) => url.trim());
  }
}
