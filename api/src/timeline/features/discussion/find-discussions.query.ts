import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNumber } from 'class-validator';
import { In, Repository } from 'typeorm';
import { Like } from '../../entities/like.entity';
import { DiscussionRepository } from 'src/timeline/domain/discussion.repository';

export class FindDiscussions {
  productId: number;
  @IsNumber()
  page: number;
  @IsNumber()
  pageSize: number;
  userId: number;
}

@QueryHandler(FindDiscussions)
export class FindDiscussionsQuery implements IQueryHandler<FindDiscussions> {
  constructor(
    @InjectRepository(Like)
    private likeRepo: Repository<Like>,
    private discussionRepo: DiscussionRepository
  ) {}

  async execute({
    productId,
    page,
    pageSize,
    userId,
  }: FindDiscussions): Promise<any> {
    const discussions = await this.discussionRepo.findTimelineDiscussions(
      productId,
      page,
      pageSize
    );

    const ids = discussions.map((p) => p.id);
    const likes = await this.likeRepo.find({
      where: { userId, discussionId: In(ids) },
    });
    for (const discussion of discussions)
      discussion.liked = likes.some((l) => l.discussionId === discussion.id);
    return discussions;
  }
}
