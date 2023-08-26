import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Not, Repository } from 'typeorm';
import { SprintBacklogItem } from '../entities/sprint-backlog-item.entity';
import { Transactional } from 'typeorm-transactional';

export class MoveSprintBacklogItemCommand {
  issueId: number;
  sprintId: number;
  order: number;
}

@CommandHandler(MoveSprintBacklogItemCommand)
export class MoveSprintBacklogItemHandler
  implements ICommandHandler<MoveSprintBacklogItemCommand>
{
  constructor(
    @InjectRepository(SprintBacklogItem)
    private sprintBacklogItemRepo: Repository<SprintBacklogItem>
  ) {}

  @Transactional()
  async execute({
    issueId,
    sprintId,
    order,
  }: MoveSprintBacklogItemCommand): Promise<any> {
    const item = await this.sprintBacklogItemRepo.findOneBy({
      issueId,
      sprintId,
    });

    const newOrder = order;
    const oldOrder = item.order;

    this.sprintBacklogItemRepo.update(
      { issueId, sprintId },
      { order: newOrder }
    );

    if (oldOrder < newOrder) {
      this.sprintBacklogItemRepo.update(
        {
          issueId: Not(Equal(issueId)),
          sprintId,
          order: Between(oldOrder, newOrder),
        },
        { order: () => '"order" - 1' }
      );
    } else {
      this.sprintBacklogItemRepo.update(
        {
          issueId: Not(Equal(issueId)),
          sprintId,
          order: Between(newOrder, oldOrder),
        },
        { order: () => '"order" + 1' }
      );
    }
  }
}
