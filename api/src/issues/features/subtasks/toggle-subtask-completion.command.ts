import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { SubTask } from '../../entities/subtask.entity';
import { Repository } from 'typeorm';

export class ToggleSubTaskCompletion {
  constructor(public id: number) {}
}

@CommandHandler(ToggleSubTaskCompletion)
export class ToggleSubTaskCompletionCommand
  implements ICommandHandler<ToggleSubTaskCompletion>
{
  constructor(
    @InjectRepository(SubTask)
    private subTaskRepo: Repository<SubTask>
  ) {}

  async execute({ id }: ToggleSubTaskCompletion): Promise<any> {
    this.subTaskRepo.update({ id }, { completed: () => `not "completed"` });
  }
}
