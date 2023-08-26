import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Sprint, SprintStatus } from '../entities/sprint.entity';
import { Repository } from 'typeorm';

export class FindPastSprints {
  productId: number;
}

@QueryHandler(FindPastSprints)
export class FindPastSprintsHandler implements IQueryHandler<FindPastSprints> {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>
  ) {}

  async execute({ productId }: FindPastSprints): Promise<any> {
    return this.sprintRepo.find({
      where: { productId, status: SprintStatus.COMPLETED },
      relations: { items: { issue: { assignees: true } } },
      order: { endedAt: 'desc' },
    });
  }
}
