import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Equal, Not, Repository } from 'typeorm';
import { Sprint } from '../entities/sprint.entity';
import { Transactional } from 'typeorm-transactional';

export class MoveSprintCommand {
  id: number;
  order: number;
}

@CommandHandler(MoveSprintCommand)
export class MoveSprintHandler implements ICommandHandler<MoveSprintCommand> {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>
  ) {}

  @Transactional()
  async execute({ id, order }: MoveSprintCommand): Promise<any> {
    const sprint = await this.sprintRepo.findOneBy({ id });
    const newOrder = order;
    const oldOrder = sprint.order;

    this.sprintRepo.update({ id }, { order: newOrder });

    if (oldOrder < newOrder) {
      this.sprintRepo.update(
        {
          id: Not(Equal(id)),
          order: Between(oldOrder, newOrder),
        },
        { order: () => '"order" - 1' }
      );
    } else {
      this.sprintRepo.update(
        {
          id: Not(Equal(id)),
          order: Between(newOrder, oldOrder),
        },
        { order: () => '"order" + 1' }
      );
    }
  }
}
