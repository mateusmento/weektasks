import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from '../../entities/issue.entity';
import { QueryRunner, Repository } from 'typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';
import { patchObject } from 'src/object.functions';
import { Transactional } from 'typeorm-transactional';
import { EventEmitter2 } from '@nestjs/event-emitter';

export class RemoveIssueCommand {
  issueId: number;
}

export class IssueRemoved {
  issueId: number;

  constructor(partial: Partial<IssueRemoved> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(RemoveIssueCommand)
export class RemoveIssueHandler
  implements ICommandHandler<RemoveIssueCommand, QueryRunner>
{
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
    private emitter: EventEmitter2
  ) {}

  @Transactional()
  async execute({ issueId }: RemoveIssueCommand): Promise<any> {
    const issue = await this.issueRepo.findOneBy({ id: issueId });
    if (!issue)
      throw new HttpException('Issue not found', HttpStatus.NOT_FOUND);
    await this.issueRepo.delete(issueId);
    const event = new IssueRemoved({ issueId });
    await this.emitter.emitAsync(IssueRemoved.name, event);
  }
}
