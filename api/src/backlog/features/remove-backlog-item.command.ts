import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, MoreThan, Not, Repository } from 'typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';
import { patchObject } from 'src/object.functions';
import { Transactional } from 'typeorm-transactional';

export class RemoveBacklogItemCommand {
  productId: number;
  issueId: number;

  constructor(partial: Partial<RemoveBacklogItemCommand> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(RemoveBacklogItemCommand)
export class RemoveBacklogItemHandler
  implements ICommandHandler<RemoveBacklogItemCommand>
{
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>
  ) {}

  @Transactional()
  async execute({
    productId,
    issueId,
  }: RemoveBacklogItemCommand): Promise<any> {
    const item = await this.backlogItemRepo.findOneBy({ issueId, productId });
    if (!item) throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    this.backlogItemRepo.delete({ issueId, productId });
    this.backlogItemRepo.update(
      {
        issueId: Not(Equal(issueId)),
        productId,
        order: MoreThan(item.order),
      },
      { order: () => '"order" - 1' }
    );
  }
}
