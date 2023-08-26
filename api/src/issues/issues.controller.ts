import {
  Controller,
  Body,
  Patch,
  Param,
  UseGuards,
  Delete,
  Put,
  Get,
  Query,
  Post,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { UpdateIssueCommand } from './features/issues/update-issue.command';
import { patchObject } from 'src/object.functions';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { RemoveIssueCommand } from './features/issues/remove-issue.command';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { AssignUser as AssignUser } from './features/issues/assign-user.command';
import { FindIssueQuery } from './features/issues/find-issue.query';
import { FindIssues } from './features/issues/find-issues.query';
import { AddComment } from './features/comments/add-comment.command';
import { FindComments } from './features/comments/find-comments.query';
import { CreateSubTask } from './features/subtasks/create-subtask.command';
import { RemoveAssignee } from './features/issues/remove-assignee.command';

@UseGuards(JwtAuthGuard)
@Controller('/issues')
export class IssuesController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get(':id')
  findIssue(@Param('id') issueId: number) {
    return this.queryBus.execute(new FindIssueQuery({ issueId }));
  }

  @Get()
  findIssues(
    @Query('search') searchQuery: string,
    @Query('productId') productId: number
  ) {
    return this.queryBus.execute(new FindIssues({ productId, searchQuery }));
  }

  @Patch(':id')
  update(@Param('id') issueId: number, @Body() command: UpdateIssueCommand) {
    command = patchObject(command, { issueId });
    return this.commandBus.execute(command);
  }

  @Delete(':id')
  remove(@Param('id') issueId: number) {
    const command = patchObject(new RemoveIssueCommand(), { issueId });
    this.commandBus.execute(command);
  }

  @Put(':id/assigned-to')
  assignUser(
    @Param('id') issueId: number,
    @Body('assigneeId') assigneeId: number,
    @AuthUser() user: any
  ) {
    const command = new AssignUser({ issueId, assigneeId, userId: user.id });
    return this.commandBus.execute(command);
  }

  @Delete(':id/assignee/:assigneeId')
  removeAssignee(
    @Param('id') issueId: number,
    @Param('assigneeId') assigneeId: number,
    @AuthUser() user: any
  ) {
    const command = new RemoveAssignee({
      issueId,
      assigneeId,
      userId: user.id,
    });
    return this.commandBus.execute(command);
  }

  @Post(':id/comments')
  addComment(
    @Param('id') issueId: number,
    @Body() command: AddComment,
    @AuthUser() user
  ) {
    patchObject(command, { issueId, authorId: user.id });
    return this.commandBus.execute(command);
  }

  @Get(':id/comments')
  findComments(@Param('id') issueId: number) {
    return this.queryBus.execute(new FindComments({ issueId }));
  }

  @Post(':id/subtasks')
  createSubTask(@Param('id') issueId, @Body() command: CreateSubTask) {
    return this.commandBus.execute(patchObject(command, { issueId }));
  }
}
