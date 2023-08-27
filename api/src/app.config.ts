import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfig {
  APP_PORT: number = 0;
  COOKIE_SECRET: string = '';
  DATABASE_HOST: string = '';
  DATABASE_MIGRATION_HOST: string = '';
  DATABASE_PORT: number = 0;
  POSTGRES_DB: string = '';
  POSTGRES_USER: string = '';
  POSTGRES_PASSWORD: string = '';
  REDIS_URL: string = '';
  JWT_SECRET: string = '';
  JWT_EXPIRES_IN: string = '';
  PASSWORD_ROUNDS: string = '';

  constructor(private config: ConfigService) {
    const keys = Object.getOwnPropertyNames(this).filter(
      (k) => !['config'].includes(k)
    );

    for (const key of keys)
      Object.defineProperty(this, key, { get: () => config.get(key) });
  }

  get CORS_ORIGINS(): string[] {
    return this.config
      .get('CORS_ORIGINS')
      .split(',')
      .map((url) => url.trim());
  }
}
