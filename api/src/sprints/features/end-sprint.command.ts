import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CannotEndSprintException, Sprint } from '../entities/sprint.entity';
import { Repository } from 'typeorm';
import { IsNumber } from 'class-validator';
import { patchObject } from 'src/object.functions';
import { SprintBacklogItem } from '../entities/sprint-backlog-item.entity';
import { Transactional } from 'typeorm-transactional';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class EndSprintCommand {
  @IsNumber()
  sprintId: number;

  constructor(partial: Partial<EndSprintCommand> = {}) {
    patchObject(this, partial);
  }
}

export class SprintEnded {
  sprintId: number;
  productId: number;
  completedItems: SprintBacklogItem[];
  pendingItems: SprintBacklogItem[];

  constructor(partial: Partial<SprintEnded> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(EndSprintCommand)
export class EndSprintHandler implements ICommandHandler<EndSprintCommand> {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>,
    private emitter: EventEmitter2
  ) {}

  @Transactional()
  async execute({ sprintId }: EndSprintCommand): Promise<any> {
    let sprint = await this.sprintRepo.findOne({
      where: { id: sprintId },
      relations: {
        items: { issue: true },
      },
    });

    if (sprint.items.some((i) => i.issue.status === 'doing'))
      throw new CannotEndSprintException('sprint has issues in progress');

    sprint.end();
    sprint = await this.sprintRepo.save(sprint);

    const event = new SprintEnded({
      sprintId: sprint.id,
      productId: sprint.productId,
      completedItems: sprint.items.filter((i) => i.issue.status === 'done'),
      pendingItems: sprint.items.filter((i) => i.issue.status === 'todo'),
    });
    await this.emitter.emitAsync(SprintEnded.name, event);

    return sprint;
  }
}
