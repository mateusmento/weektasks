import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Allow } from 'class-validator';
import * as moment from 'moment';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Sprint, SprintStatus } from '../entities/sprint.entity';

export class CreateSprintCommand {
  productId: number;
  @Allow()
  title: string;
}

@CommandHandler(CreateSprintCommand)
export class CreateSprintHandler
  implements ICommandHandler<CreateSprintCommand>
{
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>
  ) {}

  @Transactional()
  async execute({ productId, ...sprint }: CreateSprintCommand): Promise<any> {
    const max = await this.sprintRepo
      .createQueryBuilder('sprint')
      .select('max(sprint.order)', 'order')
      .addSelect('max(sprint.endedAt)', 'endedAt')
      .where('sprint.productId = :productId', { productId })
      .andWhere('sprint.status <> :status', { status: SprintStatus.COMPLETED })
      .getRawOne();

    const sprintDuration = 7;
    const startedAt = () =>
      max.endedAt
        ? moment.utc(max.endedAt).startOf('day').add(1, 'days')
        : moment.utc().startOf('day');
    const endedAt = startedAt()
      .add(sprintDuration - 1, 'days')
      .endOf('day');

    const order = typeof max.order === 'number' ? max.order : -1;
    sprint.title = sprint.title || `Sprint ${order + 1}`;
    return this.sprintRepo.save(
      new Sprint({
        ...sprint,
        productId,
        order: order + 1,
        startedAt: startedAt().toDate(),
        endedAt: endedAt.toDate(),
      })
    );
  }
}
