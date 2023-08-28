import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { sortBy } from 'lodash';
import { Repository } from 'typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';

export class FindBacklogItemsQuery {
  productId: number;
}

@QueryHandler(FindBacklogItemsQuery)
export class FindBacklogItemsHandler
  implements IQueryHandler<FindBacklogItemsQuery>
{
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>
  ) {}

  async execute({ productId }: FindBacklogItemsQuery): Promise<any[]> {
    let items = await this.backlogItemRepo.find({
      where: { productId },
      relations: {
        issue: { assignees: true, subtasks: true },
      },
    });
    items = sortBy(items, (i) => i.order);
    return items.map(({ issue, order }) => ({ ...issue, order }));
  }
}
