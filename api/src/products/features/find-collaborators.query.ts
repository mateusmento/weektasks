import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Collaborator } from '../entities/collaborator.entity';
import { Repository } from 'typeorm';

export class FindCollaboratorsQuery {
  productId: number;
}

@QueryHandler(FindCollaboratorsQuery)
export class FindCollaboratorsHandler
  implements IQueryHandler<FindCollaboratorsQuery>
{
  constructor(
    @InjectRepository(Collaborator)
    private collabRepo: Repository<Collaborator>
  ) {}

  async execute({ productId }: FindCollaboratorsQuery): Promise<any> {
    return this.collabRepo.find({
      where: { productId },
      relations: { user: true },
    });
  }
}
