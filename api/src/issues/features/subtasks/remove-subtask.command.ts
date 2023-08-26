import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTask } from '../../entities/subtask.entity';
import { Repository } from 'typeorm';

export class RemoveSubTask {
  constructor(public id: number) {}
}

@CommandHandler(RemoveSubTask)
export class RemoveSubTaskCommand implements ICommandHandler<RemoveSubTask> {
  constructor(
    @InjectRepository(SubTask)
    private subTaskRepo: Repository<SubTask>
  ) {}

  async execute({ id }: RemoveSubTask): Promise<any> {
    await this.subTaskRepo.delete({ id });
  }
}
