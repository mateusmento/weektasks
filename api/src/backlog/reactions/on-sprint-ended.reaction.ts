import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';
import { SprintEnded } from 'src/sprints/features/end-sprint.command';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnSprintEndedReaction {
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>
  ) {}

  @OnEvent(SprintEnded.name)
  async handle({ productId, pendingItems }: SprintEnded) {
    if (pendingItems.length === 0) return;

    const backlogItems = pendingItems.map((item, order) => ({
      productId,
      issueId: item.issueId,
      order,
    }));

    await this.backlogItemRepo.save(backlogItems);

    await this.backlogItemRepo.update(
      { productId },
      { order: () => `"order" + ${pendingItems.length}` }
    );
  }
}
