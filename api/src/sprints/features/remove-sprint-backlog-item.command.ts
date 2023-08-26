import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Equal, MoreThan, Not, Repository } from 'typeorm';
import { SprintBacklogItem } from '../entities/sprint-backlog-item.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { patchObject } from 'src/object.functions';
import { Transactional } from 'typeorm-transactional';

export class RemoveSprintBacklogItemComand {
  sprintId: number;
  issueId: number;

  constructor(partial: Partial<RemoveSprintBacklogItemComand> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(RemoveSprintBacklogItemComand)
export class RemoveSprintBacklogItemHandler
  implements ICommandHandler<RemoveSprintBacklogItemComand>
{
  constructor(
    @InjectRepository(SprintBacklogItem)
    private sprintItemRepo: Repository<SprintBacklogItem>
  ) {}

  @Transactional()
  async execute({
    issueId,
    sprintId,
  }: RemoveSprintBacklogItemComand): Promise<any> {
    const item = await this.sprintItemRepo.findOneBy({ issueId, sprintId });
    if (!item) throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    this.sprintItemRepo.delete({ issueId, sprintId });
    this.sprintItemRepo.update(
      {
        issueId: Not(Equal(issueId)),
        sprintId,
        order: MoreThan(item.order),
      },
      { order: () => '"order" - 1' }
    );
  }
}
