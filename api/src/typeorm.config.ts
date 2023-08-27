import { config as dotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppConfig } from './app.config';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

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
  namingStrategy: new SnakeNamingStrategy(),
  migrations: migrations(),
};

export default new DataSource({
  ...typeormConfig,
  host: config.DATABASE_MIGRATION_HOST ?? config.DATABASE_HOST,
});

function migrations(): any[] {
  const migrationPath = path.resolve(__dirname, '../migrations');
  if (!existsSync(migrationPath)) mkdirSync(migrationPath);
  return readdirSync(migrationPath)
    .filter((filename) => /[0-9]*-Migration.*(?<!\.d)\.(ts|js)/.test(filename))
    .map((filename) => path.parse(filename).name)
    .map((name) => require(`${migrationPath}/${name}`))
    .flatMap((module) => Object.values(module));
}
