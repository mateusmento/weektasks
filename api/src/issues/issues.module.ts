import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Issue } from './entities/issue.entity';
import { CqrsModule } from '@nestjs/cqrs';
import { IssuesController } from './issues.controller';
import { UpdateIssueHandler } from './features/issues/update-issue.command';
import { RemoveIssueHandler } from './features/issues/remove-issue.command';
import { CreateIssueHandler } from './features/issues/create-issue.command';
import { FindIssueHandler } from './features/issues/find-issue.query';
import { AssignUserHandler } from './features/issues/assign-user.command';
import { ProductsModule } from 'src/products/products.module';
import { FindIssuesHandler } from './features/issues/find-issues.query';
import { IssueComment } from './entities/issue-comment.entity';
import { AddCommentHandler } from './features/comments/add-comment.command';
import { RemoveCommentHandler } from './features/comments/remove-comment.command';
import { UpdateCommentHandler } from './features/comments/update-comment.comment';
import { FindCommentsHandler } from './features/comments/find-comments.query';
import { IssueCommentsController } from './issue-comments.controller';
import { SubTask } from './entities/subtask.entity';
import { CreateSubTaskCommand } from './features/subtasks/create-subtask.command';
import { UpdateSubTaskCommand } from './features/subtasks/update-subtask.command';
import { RemoveSubTaskCommand } from './features/subtasks/remove-subtask.command';
import { ToggleSubTaskCompletionCommand } from './features/subtasks/toggle-subtask-completion.command';
import { SubTasksController } from './subtasks.controller';
import { RemoveAssigneeCommand } from './features/issues/remove-assignee.command';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Issue, SubTask, IssueComment]),
    CqrsModule,
    ProductsModule,
    AuthModule,
  ],
  controllers: [IssuesController, SubTasksController, IssueCommentsController],
  providers: [
    CreateIssueHandler,
    FindIssueHandler,
    FindIssuesHandler,
    UpdateIssueHandler,
    RemoveIssueHandler,
    AssignUserHandler,
    RemoveAssigneeCommand,
    AddCommentHandler,
    RemoveCommentHandler,
    UpdateCommentHandler,
    FindCommentsHandler,
    CreateSubTaskCommand,
    UpdateSubTaskCommand,
    RemoveSubTaskCommand,
    ToggleSubTaskCompletionCommand,
  ],
  exports: [TypeOrmModule],
})
export class IssuesModule {}
