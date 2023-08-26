import { Module } from '@nestjs/common';
import {
  ProductsSprintsController,
  SprintIssuesController,
  SprintsController,
} from './sprints.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Sprint } from './entities/sprint.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { RemoveSprintBacklogItemHandler } from './features/remove-sprint-backlog-item.command';
import { IncludeSprintBacklogItemHandler } from './features/include-sprint-backlog-item.command';
import { MoveSprintBacklogItemHandler } from './features/move-sprint-backlog-item.command';
import { MoveSprintHandler } from './features/move-sprint.command';
import { CreateIssueInSprintHandler } from './features/create-issue-in-sprint.command';
import { RemoveSprintHandler } from './features/remove-sprint.command';
import { SprintBacklogItem } from './entities/sprint-backlog-item.entity';
import { CreateSprintHandler } from './features/create-sprint.command';
import { FindSprintsHandler } from './features/find-sprints.query';
import { UpdateSprintHandler } from './features/update-sprint.command';
import { OnIssueRemovedReaction } from './reactions/on-issue-removed.reaction';
import { StartSprintHandler } from './features/start-sprint.command';
import { EndSprintHandler } from './features/end-sprint.command';
import { BoardController } from './board.controller';
import { FindBoardHandler } from './features/find-board.query';
import { FindPastSprintsHandler } from './features/find-past-sprints.query';

@Module({
  imports: [TypeOrmModule.forFeature([Sprint, SprintBacklogItem]), CqrsModule],
  controllers: [
    ProductsSprintsController,
    SprintsController,
    SprintIssuesController,
    BoardController,
  ],
  providers: [
    FindSprintsHandler,
    CreateSprintHandler,
    UpdateSprintHandler,
    CreateIssueInSprintHandler,
    MoveSprintHandler,
    MoveSprintBacklogItemHandler,
    IncludeSprintBacklogItemHandler,
    RemoveSprintHandler,
    RemoveSprintBacklogItemHandler,
    StartSprintHandler,
    EndSprintHandler,
    FindBoardHandler,
    FindPastSprintsHandler,
    OnIssueRemovedReaction,
  ],
})
export class SprintsModule {}
