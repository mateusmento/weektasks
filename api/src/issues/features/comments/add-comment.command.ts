import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { IsString } from 'class-validator';
import { Repository } from 'typeorm';
import { IssueComment } from '../../entities/issue-comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/users/user.entity';
import { patchObject } from 'src/object.functions';

export class AddComment {
  issueId: number;
  @IsString()
  text: string;
  authorId: number;

  constructor(partial: Partial<AddComment> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(AddComment)
export class AddCommentHandler implements ICommandHandler<AddComment> {
  constructor(
    @InjectRepository(IssueComment)
    private commentRepo: Repository<IssueComment>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>
  ) {}

  async execute({ issueId, text, authorId }: AddComment): Promise<any> {
    const author = await this.userRepo.findOneBy({ id: authorId });
    return this.commentRepo.save({ issueId, text, author });
  }
}
