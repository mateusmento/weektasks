import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { patchObject } from 'src/object.functions';
import { Issue } from '../../entities/issue.entity';
import { Repository } from 'typeorm';

export class FindIssues {
  productId: number;
  searchQuery: string;

  constructor(partial: Partial<FindIssues>) {
    patchObject(this, partial);
  }
}

@QueryHandler(FindIssues)
export class FindIssuesHandler implements IQueryHandler<FindIssues> {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>
  ) {}

  async execute({ productId, searchQuery }: FindIssues): Promise<any> {
    return this.issueRepo
      .createQueryBuilder('issue')
      .where('issue.productId = :productId', { productId })
      .andWhere('issue.title like :search', { search: `%${searchQuery}%` })
      .getMany();
  }
}
