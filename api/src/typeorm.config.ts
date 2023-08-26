import { config as dotenv } from 'dotenv';
import { DataSourceOptions } from 'typeorm';
import { AppConfig } from './app.config';
import { ConfigService } from '@nestjs/config';
import { readdirSync } from 'fs';
import path from 'path';

dotenv();

const config = new AppConfig(new ConfigService());

export const typeormConfig: DataSourceOptions = {
  type: 'postgres',
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  database: config.POSTGRES_DB,
  username: config.POSTGRES_USER,
  password: config.POSTGRES_PASSWORD,
  logging: 'all',
  logger: 'advanced-console',
  entities: [],
  migrations: migrations(),
};

function migrations(): any[] {
  const migrationPath = path.resolve(__dirname, '../migrations');
  return readdirSync(migrationPath)
    .filter((filename) => /[0-9]*-Migration.*(?<!\.d)\.(ts|js)/.test(filename))
    .map((filename) => path.parse(filename).name)
    .map((name) => require(`${migrationPath}/${name}`))
    .flatMap((module) => Object.values(module));
}
