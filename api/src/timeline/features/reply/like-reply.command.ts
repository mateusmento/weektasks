import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { patchObject } from 'src/object.functions';
import { ReplyLike } from 'src/timeline/entities/reply-like.entity';
import { Reply } from 'src/timeline/entities/reply.entity';
import { Repository } from 'typeorm';

export class LikeReply {
  replyId: number;
  userId: number;
  constructor(partial: Partial<LikeReply>) {
    patchObject(this, partial);
  }
}

@CommandHandler(LikeReply)
export class LikeReplyCommand implements ICommandHandler<LikeReply> {
  constructor(
    @InjectRepository(Reply)
    private replyRepo: Repository<Reply>,
    @InjectRepository(ReplyLike)
    private likeRepo: Repository<ReplyLike>
  ) {}

  async execute({ replyId, userId }: LikeReply): Promise<any> {
    const { affected } = await this.likeRepo.delete({ replyId, userId });
    if (affected) {
      await this.replyRepo.update(
        { id: replyId },
        { likes: () => `"likes" - 1` }
      );
    } else {
      await this.likeRepo.save({ discussionId: replyId, userId });
      await this.replyRepo.update(
        { id: replyId },
        { likes: () => `"likes" + 1` }
      );
    }
  }
}
