import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNumber } from 'class-validator';
import { In, Repository } from 'typeorm';
import { Discussion } from '../../entities/discussion.entity';
import { Like } from '../../entities/like.entity';

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
    @InjectRepository(Discussion)
    private discussionRepo: Repository<Discussion>,
    @InjectRepository(Like)
    private likeRepo: Repository<Like>
  ) {}

  async execute({
    productId,
    page,
    pageSize,
    userId,
  }: FindDiscussions): Promise<any> {
    const discussions = await this.discussionRepo.find({
      where: { productId },
      order: { id: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });
    const ids = discussions.map((p) => p.id);
    const likes = await this.likeRepo.find({
      where: { userId, discussionId: In(ids) },
    });
    for (const discussion of discussions)
      discussion.liked = likes.some((l) => l.discussionId === discussion.id);
    return discussions;
  }
}
