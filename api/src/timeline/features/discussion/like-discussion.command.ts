import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { patchObject } from 'src/object.functions';
import { Repository } from 'typeorm';
import { Discussion } from '../../entities/discussion.entity';
import { Like } from '../../entities/like.entity';

export class LikeDiscussion {
  discussionId: number;
  userId: number;
  constructor(partial: Partial<LikeDiscussion>) {
    patchObject(this, partial);
  }
}

@CommandHandler(LikeDiscussion)
export class LikeDiscussionCommand implements ICommandHandler<LikeDiscussion> {
  constructor(
    @InjectRepository(Discussion)
    private discussionRepo: Repository<Discussion>,
    @InjectRepository(Like)
    private likeRepo: Repository<Like>
  ) {}

  async execute({ discussionId, userId }: LikeDiscussion): Promise<any> {
    const { affected } = await this.likeRepo.delete({ discussionId, userId });
    if (affected) {
      await this.discussionRepo.update(
        { id: discussionId },
        { likes: () => `"likes" - 1` }
      );
    } else {
      await this.likeRepo.save({ discussionId, userId });
      await this.discussionRepo.update(
        { id: discussionId },
        { likes: () => `"likes" + 1` }
      );
    }
  }
}
