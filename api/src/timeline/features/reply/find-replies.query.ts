import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { patchObject } from 'src/object.functions';
import { ReplyLike } from 'src/timeline/entities/reply-like.entity';
import { In, Repository } from 'typeorm';
import { Reply } from '../../entities/reply.entity';

export class FindReplies {
  discussionId: number;
  userId: number;

  constructor(partial: Partial<FindReplies> = {}) {
    patchObject(this, partial);
  }
}

@QueryHandler(FindReplies)
export class FindRepliesQuery implements IQueryHandler<FindReplies> {
  constructor(
    @InjectRepository(Reply)
    private replyRepo: Repository<Reply>,
    @InjectRepository(ReplyLike)
    private likeRepo: Repository<ReplyLike>
  ) {}

  async execute({ userId, discussionId }: FindReplies): Promise<any> {
    const replies = await this.replyRepo.find({ where: { discussionId } });
    const ids = replies.map((p) => p.id);
    const likes = await this.likeRepo.find({
      where: { userId, replyId: In(ids) },
    });
    for (const reply of replies)
      reply.liked = likes.some((l) => l.replyId === reply.id);
    return replies;
  }
}
