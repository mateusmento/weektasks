import { HttpException, HttpStatus } from '@nestjs/common';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { patchObject } from 'src/object.functions';
import { Repository } from 'typeorm';
import { Sprint, SprintStatus } from '../entities/sprint.entity';

export class FindBoard {
  productId: number;

  constructor(partial: Partial<FindBoard>) {
    patchObject(this, partial);
  }
}

@QueryHandler(FindBoard)
export class FindBoardHandler implements IQueryHandler<FindBoard> {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>
  ) {}

  async execute({ productId }: FindBoard): Promise<any> {
    const sprint = await this.sprintRepo.findOne({
      where: {
        status: SprintStatus.IN_PROGRESS,
        productId,
      },
      relations: {
        items: { issue: { assignees: true, subtasks: true } },
      },
    });

    if (!sprint)
      throw new HttpException(
        'Board not found for sprint in execution',
        HttpStatus.NOT_FOUND
      );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { items, ...sprintData } = sprint;

    return {
      sprint: sprintData,
      issues: {
        todo: sprint.sortedIssues.filter((i) => i.status === 'todo'),
        doing: sprint.sortedIssues.filter((i) => i.status === 'doing'),
        done: sprint.sortedIssues.filter((i) => i.status === 'done'),
      },
    };
  }
}
