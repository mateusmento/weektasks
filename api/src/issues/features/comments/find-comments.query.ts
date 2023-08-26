import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { patchObject } from 'src/object.functions';
import { IssueComment } from '../../entities/issue-comment.entity';
import { Repository } from 'typeorm';

export class FindComments {
  issueId: number;

  constructor(partial: Partial<FindComments> = {}) {
    patchObject(this, partial);
  }
}

@QueryHandler(FindComments)
export class FindCommentsHandler implements IQueryHandler<FindComments> {
  constructor(
    @InjectRepository(IssueComment)
    private commentRepo: Repository<IssueComment>
  ) {}

  async execute({ issueId }: FindComments): Promise<any> {
    return this.commentRepo.find({
      where: { issueId },
      relations: { author: true },
      order: { id: 'desc' },
    });
  }
}
