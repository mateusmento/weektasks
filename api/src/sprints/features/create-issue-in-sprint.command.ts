import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Allow, IsNotEmpty } from 'class-validator';
import { Repository } from 'typeorm';
import { Sprint } from '../entities/sprint.entity';
import { SprintBacklogItem } from '../entities/sprint-backlog-item.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Issue } from 'src/issues/entities/issue.entity';
import { Transactional } from 'typeorm-transactional';
import { CreateIssueCommand } from 'src/issues/features/issues/create-issue.command';

export class CreateIssueInSprintCommand {
  sprintId: number;
  @IsNotEmpty()
  title: string;
  @Allow()
  description?: string;
  order: number;
}

@CommandHandler(CreateIssueInSprintCommand)
export class CreateIssueInSprintHandler
  implements ICommandHandler<CreateIssueInSprintCommand>
{
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>,
    @InjectRepository(SprintBacklogItem)
    private sprintBacklogItemRepo: Repository<SprintBacklogItem>,
    private commandBus: CommandBus
  ) {}

  @Transactional()
  async execute({
    sprintId,
    ...command
  }: CreateIssueInSprintCommand): Promise<any> {
    const sprint = await this.sprintRepo.findOneBy({ id: sprintId });
    if (!sprint)
      throw new HttpException('Sprint not found', HttpStatus.NOT_FOUND);
    const issue: Issue = await this.commandBus.execute(
      new CreateIssueCommand({ productId: sprint.productId, ...command })
    );
    const order = await this.findNextOrder(sprintId);
    const item = { sprintId, issueId: issue.id, order };
    await this.sprintBacklogItemRepo.save(item);
    return { ...issue, order };
  }

  async findNextOrder(sprintId: number) {
    const issue = await this.sprintBacklogItemRepo
      .createQueryBuilder('item')
      .select('max(item.order)', 'maxOrder')
      .where('item.sprintId = :sprintId', { sprintId })
      .getRawOne();
    return (issue.maxOrder ?? -1) + 1;
  }
}
