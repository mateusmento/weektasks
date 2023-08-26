import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Allow } from 'class-validator';
import { Issue, IssueStatus } from '../../entities/issue.entity';
import { Repository } from 'typeorm';
import { patchObject } from 'src/object.functions';
import { Transactional } from 'typeorm-transactional';

export class UpdateIssueCommand {
  issueId: number;
  @Allow()
  title?: string;
  @Allow()
  description?: string;
  @Allow()
  status?: IssueStatus;
  @Allow()
  estimation?: number;
  @Allow()
  type?: string;
}

@CommandHandler(UpdateIssueCommand)
export class UpdateIssueHandler implements ICommandHandler<UpdateIssueCommand> {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>
  ) {}

  @Transactional()
  async execute({ issueId, ...command }: UpdateIssueCommand): Promise<any> {
    const issue = await this.issueRepo.findOneBy({ id: issueId });
    patchObject(issue, command);
    return this.issueRepo.save(issue);
  }
}
