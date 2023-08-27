import { config as dotenv } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import { AppConfig } from './app.config';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, readdirSync } from 'fs';
import * as path from 'path';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { CredentialEntity } from './auth/domain/credential.entity';
import { UserEntity } from './auth/domain/user.entity';
import { BacklogItem } from './backlog/entities/backlog-item.entity';
import { ContactEntity } from './contact/contact.entity';
import { Issue } from './issues/entities/issue.entity';
import { Epic } from './issues/entities/epic.entity';
import { IssueComment } from './issues/entities/issue-comment.entity';
import { SubTask } from './issues/entities/subtask.entity';
import { MeetingAttendeeEntity, MeetingEntity } from './meeting/meeting.entity';
import { MessageEntity } from './messaging/message.entity';
import { Collaborator } from './products/entities/collaborator.entity';
import { Product } from './products/entities/product.entity';
import { Sprint } from './sprints/entities/sprint.entity';
import { SprintBacklogItem } from './sprints/entities/sprint-backlog-item.entity';
import { Discussion } from './timeline/entities/discussion.entity';
import { Like } from './timeline/entities/like.entity';
import { ReplyLike } from './timeline/entities/reply-like.entity';
import { Reply } from './timeline/entities/reply.entity';

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
  entities: [
    CredentialEntity,
    UserEntity,
    BacklogItem,
    ContactEntity,
    Issue,
    Epic,
    IssueComment,
    SubTask,
    MeetingEntity,
    MeetingAttendeeEntity,
    MessageEntity,
    Collaborator,
    Product,
    Sprint,
    SprintBacklogItem,
    Discussion,
    Like,
    ReplyLike,
    Reply,
  ],
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
