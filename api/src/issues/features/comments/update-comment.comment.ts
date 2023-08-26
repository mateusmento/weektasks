import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsString } from 'class-validator';
import { Repository } from 'typeorm';
import { patchObject } from 'src/object.functions';
import { HttpException, HttpStatus } from '@nestjs/common';
import { IssueComment } from 'src/issues/entities/issue-comment.entity';

export class UpdateComment {
  commentId: number;
  @IsString()
  text: string;
}

@CommandHandler(UpdateComment)
export class UpdateCommentHandler implements ICommandHandler<UpdateComment> {
  constructor(
    @InjectRepository(IssueComment)
    private commentRepo: Repository<IssueComment>
  ) {}

  async execute({ commentId, ...patch }: UpdateComment): Promise<any> {
    const comment = await this.commentRepo.findOne({
      where: { id: commentId },
    });

    if (!comment)
      throw new HttpException('Comment not found', HttpStatus.NOT_FOUND);

    patchObject(comment, patch);

    return this.commentRepo.save(comment);
  }
}
