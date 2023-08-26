import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  BacklogController,
  ProductIssuesController,
} from './backlog.controller';
import { CreateIssueInBacklogHandler } from './features/create-issue-in-backlog.command';
import { FindBacklogItemsHandler } from './features/find-backlog-items.query';
import { MoveBacklogItemHandler } from './features/move-backlog-item.command';
import { IncludeBacklogItemHandler } from './features/include-backlog-item.command';
import { RemoveBacklogItemHandler } from './features/remove-backlog-item.command';
import { BacklogItem } from './entities/backlog-item.entity';
import { OnSprintRemovedReaction } from './reactions/on-sprint-removed.reaction';
import { OnIssueRemovedReaction } from './reactions/on-issue-removed.reaction';
import { OnSprintEndedReaction } from './reactions/on-sprint-ended.reaction';

@Module({
  imports: [TypeOrmModule.forFeature([BacklogItem]), CqrsModule],
  controllers: [BacklogController, ProductIssuesController],
  providers: [
    FindBacklogItemsHandler,
    CreateIssueInBacklogHandler,
    RemoveBacklogItemHandler,
    MoveBacklogItemHandler,
    IncludeBacklogItemHandler,
    OnSprintRemovedReaction,
    OnIssueRemovedReaction,
    OnSprintEndedReaction,
  ],
  exports: [TypeOrmModule],
})
export class BacklogModule {}
