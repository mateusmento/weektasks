import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { patchObject } from 'src/object.functions';
import { Repository } from 'typeorm';
import { Discussion } from '../../entities/discussion.entity';
import { Like } from '../../entities/like.entity';

export class FindDiscussion {
  id: number;
  userId: number;

  constructor(partial: Partial<FindDiscussion>) {
    patchObject(this, partial);
  }
}

@QueryHandler(FindDiscussion)
export class FindDiscussionQuery implements IQueryHandler<FindDiscussion> {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepo: Repository<Discussion>,
    @InjectRepository(Like)
    private likeRepo: Repository<Like>
  ) {}

  async execute({ id, userId }: FindDiscussion): Promise<any> {
    const discussion = await this.discussionRepo.findOneBy({ id });
    discussion.liked = await this.likeRepo.exist({
      where: { userId, discussionId: id },
    });
    return discussion;
  }
}
