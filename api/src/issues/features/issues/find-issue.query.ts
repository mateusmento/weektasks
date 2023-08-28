import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from '../../entities/issue.entity';
import { Repository } from 'typeorm';
import { patchObject } from 'src/object.functions';
import { sortBy } from 'lodash';

export class FindIssueQuery {
  issueId: number;

  constructor(partial: Partial<FindIssueQuery> = {}) {
    patchObject(this, partial);
  }
}

@QueryHandler(FindIssueQuery)
export class FindIssueHandler implements IQueryHandler<FindIssueQuery> {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>
  ) {}

  async execute({ issueId }: FindIssueQuery): Promise<any> {
    const issue = await this.issueRepo.findOne({
      where: { id: issueId },
      relations: { subtasks: true },
    });
    issue.subtasks = sortBy(issue.subtasks, (s) => s.id);
    return issue;
  }
}
