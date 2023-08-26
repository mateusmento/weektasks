import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Sprint } from '../entities/sprint.entity';
import { SprintBacklogItem } from '../entities/sprint-backlog-item.entity';
import { patchObject } from 'src/object.functions';
import { Transactional } from 'typeorm-transactional';

export class RemoveSprintCommand {
  id: number;
  productId: number;
}

export class SprintRemovedEvent {
  sprintId: number;
  productId: number;
  items: SprintBacklogItem[];

  constructor(partial: Partial<SprintRemovedEvent> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(RemoveSprintCommand)
export class RemoveSprintHandler
  implements ICommandHandler<RemoveSprintCommand>
{
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>,
    @InjectRepository(SprintBacklogItem)
    private sprintItemRepo: Repository<SprintBacklogItem>,
    private eventBus: EventBus
  ) {}

  @Transactional()
  async execute({ id }: RemoveSprintCommand): Promise<any> {
    const sprint = await this.sprintRepo.findOneBy({ id });
    const items = await this.sprintItemRepo.findBy({ sprintId: id });

    this.sprintItemRepo.delete({ sprintId: id });
    this.sprintRepo.delete(id);

    this.eventBus.publish(
      new SprintRemovedEvent({
        sprintId: sprint.id,
        productId: sprint.productId,
        items,
      })
    );
  }
}
