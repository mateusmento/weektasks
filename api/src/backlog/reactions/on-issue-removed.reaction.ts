import { InjectRepository } from '@nestjs/typeorm';
import { BacklogItem } from '../entities/backlog-item.entity';
import { Repository } from 'typeorm';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveBacklogItemCommand } from '../features/remove-backlog-item.command';
import { IssueRemoved } from 'src/issues/features/issues/remove-issue.command';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnIssueRemovedReaction {
  constructor(
    @InjectRepository(BacklogItem)
    private backlogItemRepo: Repository<BacklogItem>,
    private commandBus: CommandBus
  ) {}

  @OnEvent(IssueRemoved.name)
  async handle({ issueId }: IssueRemoved) {
    const item = await this.backlogItemRepo.findOneBy({ issueId });
    if (!item) return;
    const command = new RemoveBacklogItemCommand({
      issueId,
      productId: item.productId,
    });
    return this.commandBus.execute(command);
  }
}
