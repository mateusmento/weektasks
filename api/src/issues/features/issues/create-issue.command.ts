import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler, QueryBus } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Allow, IsNotEmpty } from 'class-validator';
import { patchObject } from 'src/object.functions';
import { FindProductQuery } from 'src/products/features/find-product.query';
import { Repository } from 'typeorm';
import { Transactional } from 'typeorm-transactional';
import { Issue } from '../../entities/issue.entity';

export class CreateIssueCommand {
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  type: string;

  @Allow()
  description?: string;
  productId: number;

  constructor(partial: Partial<CreateIssueCommand> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(CreateIssueCommand)
export class CreateIssueHandler implements ICommandHandler<CreateIssueCommand> {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
    private queryBus: QueryBus
  ) {}

  @Transactional()
  async execute({ productId, ...command }: CreateIssueCommand): Promise<Issue> {
    const product = await this.queryBus.execute(
      new FindProductQuery({ productId })
    );
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    let issue = await this.issueRepo.save({ ...command, productId });
    issue = await this.issueRepo.findOne({
      where: { id: issue.id },
      relations: { assignees: true, subtasks: true },
    });
    return issue;
  }
}
