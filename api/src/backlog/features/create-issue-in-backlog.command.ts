import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Allow, IsNotEmpty } from 'class-validator';
import { Issue } from 'src/issues/entities/issue.entity';
import { Repository } from 'typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';
import { Transactional } from 'typeorm-transactional';
import { CreateIssueCommand } from 'src/issues/features/issues/create-issue.command';

export class CreateIssueInBacklogCommand {
  @IsNotEmpty()
  title: string;
  @IsNotEmpty()
  type: string;
  @Allow()
  description?: string;
  productId: number;
}

@CommandHandler(CreateIssueInBacklogCommand)
export class CreateIssueInBacklogHandler
  implements ICommandHandler<CreateIssueInBacklogCommand>
{
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>,
    private commandBus: CommandBus
  ) {}

  @Transactional()
  async execute({
    productId,
    ...command
  }: CreateIssueInBacklogCommand): Promise<Issue> {
    const issue = await this.commandBus.execute(
      new CreateIssueCommand({ productId, ...command })
    );
    const order = await this.findNextOrder(productId);
    await this.backlogItemRepo.save({ issueId: issue.id, productId, order });
    return issue;
  }

  async findNextOrder(productId: number) {
    const issue = await this.backlogItemRepo
      .createQueryBuilder('item')
      .select('max(item.order)', 'maxOrder')
      .where('item.productId = :productId', { productId })
      .getRawOne();

    return (issue.maxOrder ?? -1) + 1;
  }
}
