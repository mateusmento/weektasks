import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Issue } from '../../entities/issue.entity';
import { Repository } from 'typeorm';
import { Collaborator } from 'src/products/entities/collaborator.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Product } from 'src/products/entities/product.entity';
import { patchObject } from 'src/object.functions';

export class AssignUser {
  issueId: number;
  assigneeId: number;
  userId: number;

  constructor(partial: Partial<AssignUser> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(AssignUser)
export class AssignUserHandler implements ICommandHandler<AssignUser> {
  constructor(
    @InjectRepository(Issue)
    private issueRepo: Repository<Issue>,
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Collaborator)
    private collabRepo: Repository<Collaborator>
  ) {}

  async execute({ issueId, assigneeId, userId }: AssignUser): Promise<any> {
    const issue = await this.issueRepo.findOne({
      where: { id: issueId },
      relations: { assignees: true },
    });

    const product = await this.productRepo.findOne({
      where: { id: issue.productId },
    });

    if (product.ownerId !== userId && assigneeId !== userId)
      throw new HttpException(
        "User can't assign collaborator to issue",
        HttpStatus.FORBIDDEN
      );

    const collab = await this.collabRepo.findOne({
      where: { userId: assigneeId, productId: issue.productId },
      relations: { user: true },
    });

    if (!collab)
      throw new HttpException(
        'User is not a member of the project to collaborate with issues',
        HttpStatus.FORBIDDEN
      );

    issue.assignees.push(collab.user);
    return await this.issueRepo.save(issue);
  }
}
