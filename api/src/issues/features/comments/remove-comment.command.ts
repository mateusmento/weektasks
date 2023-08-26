import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { patchObject } from 'src/object.functions';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { IssueComment } from 'src/issues/entities/issue-comment.entity';

export class RemoveComment {
  commentId: number;

  constructor(partial: Partial<RemoveComment> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(RemoveComment)
export class RemoveCommentHandler implements ICommandHandler<RemoveComment> {
  constructor(
    @InjectRepository(IssueComment)
    private commentRepo: Repository<IssueComment>
  ) {}

  async execute({ commentId }: RemoveComment): Promise<any> {
    await this.commentRepo.delete({ id: commentId });
  }
}
