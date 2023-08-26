import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SprintBacklogItem } from '../entities/sprint-backlog-item.entity';
import { CommandBus } from '@nestjs/cqrs';
import { RemoveSprintBacklogItemComand } from '../features/remove-sprint-backlog-item.command';
import { IssueRemoved } from 'src/issues/features/issues/remove-issue.command';
import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class OnIssueRemovedReaction {
  constructor(
    @InjectRepository(SprintBacklogItem)
    private sprintItemRepo: Repository<SprintBacklogItem>,
    private commandBus: CommandBus
  ) {}

  @OnEvent(IssueRemoved.name)
  async handle({ issueId }: IssueRemoved) {
    const item = await this.sprintItemRepo.findOneBy({ issueId });
    if (!item) return;
    const command = new RemoveSprintBacklogItemComand({
      issueId,
      sprintId: item.sprintId,
    });
    this.commandBus.execute(command);
  }
}
