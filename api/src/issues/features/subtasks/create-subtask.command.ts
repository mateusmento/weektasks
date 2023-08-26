import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNotEmpty } from 'class-validator';
import { SubTask } from '../../entities/subtask.entity';
import { Repository } from 'typeorm';

export class CreateSubTask {
  issueId: number;
  @IsNotEmpty()
  title: string;
}

@CommandHandler(CreateSubTask)
export class CreateSubTaskCommand implements ICommandHandler<CreateSubTask> {
  constructor(
    @InjectRepository(SubTask)
    private subTaskRepo: Repository<SubTask>
  ) {}

  async execute(command: CreateSubTask): Promise<any> {
    return this.subTaskRepo.save(command);
  }
}
