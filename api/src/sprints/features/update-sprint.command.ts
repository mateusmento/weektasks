import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Allow } from 'class-validator';
import { Sprint } from '../entities/sprint.entity';
import { Repository } from 'typeorm';
import { patchObject } from 'src/object.functions';
import { Transactional } from 'typeorm-transactional';

export class UpdateSprintCommand {
  id: number;
  @Allow()
  title?: string;
}

@CommandHandler(UpdateSprintCommand)
export class UpdateSprintHandler
  implements ICommandHandler<UpdateSprintCommand>
{
  constructor(
    @InjectRepository(Sprint)
    private sprintRepo: Repository<Sprint>
  ) {}

  @Transactional()
  async execute({ id, ...command }: UpdateSprintCommand): Promise<any> {
    const sprint = await this.sprintRepo.findOneBy({ id });
    return this.sprintRepo.save(patchObject(sprint, command));
  }
}
