import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, MoreThanOrEqual, Not, Repository } from 'typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';
import { Transactional } from 'typeorm-transactional';
import { IsNumber } from 'class-validator';
import { FindProductQuery } from 'src/products/features/find-product.query';
import { HttpException, HttpStatus } from '@nestjs/common';
import { FindIssueQuery } from 'src/issues/features/issues/find-issue.query';

export class IncludeBacklogItemCommand {
  productId: number;
  @IsNumber()
  issueId: number;
  @IsNumber()
  order: number;
}

@CommandHandler(IncludeBacklogItemCommand)
export class IncludeBacklogItemHandler
  implements ICommandHandler<IncludeBacklogItemCommand>
{
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>,
    private queryBus: QueryBus
  ) {}

  @Transactional()
  async execute({
    productId,
    issueId,
    order,
  }: IncludeBacklogItemCommand): Promise<any> {
    const product = await this.queryBus.execute(
      new FindProductQuery({ productId })
    );
    if (!product)
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    const issue = await this.queryBus.execute(new FindIssueQuery({ issueId }));
    if (!issue)
      throw new HttpException('Project not found', HttpStatus.NOT_FOUND);
    this.backlogItemRepo.update(
      {
        issueId: Not(Equal(issueId)),
        productId,
        order: MoreThanOrEqual(order),
      },
      { order: () => '"order" + 1' }
    );
    await this.backlogItemRepo.save({ issueId, productId, order });
    return { ...issue, order };
  }
}
