import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Between, Equal, Not, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';
import { Transactional } from 'typeorm-transactional';

export class MoveBacklogItemCommand {
  productId: number;
  issueId: number;
  order: number;
}

@CommandHandler(MoveBacklogItemCommand)
export class MoveBacklogItemHandler
  implements ICommandHandler<MoveBacklogItemCommand>
{
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>
  ) {}

  @Transactional()
  async execute({
    productId,
    issueId,
    order,
  }: MoveBacklogItemCommand): Promise<any> {
    const item = await this.backlogItemRepo.findOneBy({ issueId, productId });
    if (!item) throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);

    const newOrder = order;
    const oldOrder = item.order;

    this.backlogItemRepo.update({ issueId, productId }, { order: newOrder });

    if (oldOrder < newOrder) {
      this.backlogItemRepo.update(
        {
          issueId: Not(Equal(issueId)),
          productId,
          order: Between(oldOrder, newOrder),
        },
        { order: () => '"order" - 1' }
      );
    } else {
      this.backlogItemRepo.update(
        {
          issueId: Not(Equal(issueId)),
          productId,
          order: Between(newOrder, oldOrder),
        },
        { order: () => '"order" + 1' }
      );
    }
  }
}
