import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { SprintBacklogItem } from '../entities/sprint-backlog-item.entity';
import { Sprint } from '../entities/sprint.entity';
import { IsNumber } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';
import { FindIssueQuery } from 'src/issues/features/issues/find-issue.query';

export class IncludeSprintBacklogItemCommand {
  sprintId: number;
  @IsNumber()
  issueId: number;
  @IsNumber()
  order: number;
}

@CommandHandler(IncludeSprintBacklogItemCommand)
export class IncludeSprintBacklogItemHandler
  implements ICommandHandler<IncludeSprintBacklogItemCommand>
{
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>,
    @InjectRepository(SprintBacklogItem)
    private sprintItemRepo: Repository<SprintBacklogItem>,
    private queryBus: QueryBus
  ) {}

  @Transactional()
  async execute({
    sprintId,
    issueId,
    order,
  }: IncludeSprintBacklogItemCommand): Promise<any> {
    const issue = await this.queryBus.execute(new FindIssueQuery({ issueId }));
    if (!issue)
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    const sprint = await this.sprintRepo.findOneBy({ id: sprintId });
    if (!sprint)
      throw new HttpException('Sprint not found', HttpStatus.NOT_FOUND);
    await this.sprintItemRepo.save({ sprintId, issueId, order });
    this.sprintItemRepo.update(
      {
        issueId: Not(Equal(issueId)),
        sprintId,
        order: MoreThanOrEqual(order),
      },
      { order: () => '"order" + 1' }
    );
  }
}
