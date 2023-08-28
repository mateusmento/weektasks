import { HttpException, HttpStatus } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from 'src/issues/entities/issue.entity';
import { patchObject } from 'src/object.functions';
import { Collaborator } from 'src/products/entities/collaborator.entity';
import { Product } from 'src/products/entities/product.entity';
import { Repository } from 'typeorm';

export class RemoveAssignee {
  issueId: number;
  assigneeId: number;
  userId: number;

  constructor(partial: Partial<RemoveAssignee> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(RemoveAssignee)
export class RemoveAssigneeCommand implements ICommandHandler<RemoveAssignee> {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Collaborator)
    private collabRepo: Repository<Collaborator>
  ) {}

  async execute({ issueId, assigneeId, userId }: RemoveAssignee): Promise<any> {
    const issue = await this.issueRepo.findOne({
      where: { id: issueId },
      relations: { assignees: true },
    });

    const product = await this.productRepo.findOne({
      where: { id: issue.productId },
    });

    if (product.ownerId !== userId && assigneeId !== userId)
      throw new HttpException(
        "User can't remove assignee from issue",
        HttpStatus.FORBIDDEN
      );

    issue.assignees = issue.assignees.filter((a) => a.id !== assigneeId);
    return await this.issueRepo.save(issue);
  }
}
