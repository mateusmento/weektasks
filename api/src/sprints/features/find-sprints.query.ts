import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Sprint, SprintStatus } from '../entities/sprint.entity';

export class FindSprintsQuery {
  productId: number;
}

@QueryHandler(FindSprintsQuery)
export class FindSprintsHandler implements IQueryHandler<FindSprintsQuery> {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>
  ) {}

  async execute({ productId }: FindSprintsQuery): Promise<any> {
    return this.sprintRepo.find({
      where: { productId, status: Not(SprintStatus.COMPLETED) },
      relations: {
        items: { issue: { assignedTo: true, assignees: true, subtasks: true } },
      },
      order: { order: 'asc' },
    });
  }
}
