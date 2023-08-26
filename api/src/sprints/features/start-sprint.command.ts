import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CannotStartSprintException, Sprint } from '../entities/sprint.entity';
import { IsNull, Not, Repository } from 'typeorm';
import { IsNumber } from 'class-validator';
import { patchObject } from 'src/object.functions';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

export class StartSprintCommand {
  @IsNumber()
  sprintId: number;

  @IsNumber()
  productId: number;

  constructor(partial: Partial<StartSprintCommand> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(StartSprintCommand)
export class StartSprintHandler implements ICommandHandler<StartSprintCommand> {
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>
  ) {}

  @Transactional()
  async execute({ sprintId }: StartSprintCommand): Promise<any> {
    const sprint = await this.sprintRepo.findOneBy({ id: sprintId });

    if (!sprint)
      throw new HttpException('Sprint not found', HttpStatus.NOT_FOUND);

    const onGoingSprintExists = await this.sprintRepo.exist({
      where: {
        productId: sprint.productId,
        startedAt: Not(IsNull()),
        endedAt: IsNull(),
      },
    });

    if (onGoingSprintExists)
      throw new CannotStartSprintException('an on going sprint already exists');

    sprint.start();
    return this.sprintRepo.save(sprint);
  }
}
