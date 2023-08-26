import { Body, Controller, Delete, Param, Patch } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveComment } from './features/comments/remove-comment.command';
import { UpdateComment } from './features/comments/update-comment.comment';
import { patchObject } from 'src/object.functions';

@Controller('/issue-comments')
export class IssueCommentsController {
  constructor(private commentBus: CommandBus) {}

  @Patch(':id')
  patchComment(@Param('id') commentId: number, @Body() command: UpdateComment) {
    patchObject(command, { commentId });
    return this.commentBus.execute(command);
  }

  @Delete(':id')
  removeComment(@Param('id') commentId: number) {
    this.commentBus.execute(new RemoveComment({ commentId }));
  }
}
