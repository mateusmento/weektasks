import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from 'src/issues/entities/issue.entity';
import { Product } from 'src/products/entities/product.entity';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { UserEntity } from 'src/auth/domain/user.entity';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { BacklogItem } from './backlog/entities/backlog-item.entity';
import { IssueComment } from './issues/entities/issue-comment.entity';
import { SubTask } from './issues/entities/subtask.entity';
import { Collaborator } from './products/entities/collaborator.entity';
import { SprintBacklogItem } from './sprints/entities/sprint-backlog-item.entity';
import { Reply } from './timeline/entities/reply.entity';
import { CredentialEntity } from './auth/domain/credential.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'better-sqlite3',
        database: ':memory:',
        dropSchema: true,
        logging: false,
        logger: 'advanced-console',
        synchronize: true,
        entities: [
          Issue,
          Sprint,
          UserEntity,
          CredentialEntity,
          Product,
          SprintBacklogItem,
          BacklogItem,
          Collaborator,
          IssueComment,
          SubTask,
          Reply,
        ],
      }),
      async dataSourceFactory(options) {
        if (!options) throw new Error('Invalid options passed');
        return addTransactionalDataSource(new DataSource(options));
      },
    }),
  ],
  exports: [TypeOrmModule],
})
export class TestDatabaseModule {}
