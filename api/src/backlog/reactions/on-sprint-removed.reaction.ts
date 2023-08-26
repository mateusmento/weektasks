import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';
import { SprintRemovedEvent } from 'src/sprints/features/remove-sprint.command';

@EventsHandler(SprintRemovedEvent)
export class OnSprintRemovedReaction
  implements IEventHandler<SprintRemovedEvent>
{
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>
  ) {}

  async handle({ productId, items }: SprintRemovedEvent) {
    const backlogItems = items.map((item) => ({
      productId: productId,
      issueId: item.issueId,
      order: item.order,
    }));

    this.backlogItemRepo.save(backlogItems);

    this.backlogItemRepo.update(
      { productId },
      { order: () => `"order" + ${items.length}` }
    );
  }
}
