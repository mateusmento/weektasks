import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Allow } from 'class-validator';
import { SubTask } from '../../entities/subtask.entity';
import { Repository } from 'typeorm';

export class UpdateSubTask {
  id: number;
  @Allow()
  title: string;
}

@CommandHandler(UpdateSubTask)
export class UpdateSubTaskCommand implements ICommandHandler<UpdateSubTask> {
  constructor(
    @InjectRepository(SubTask)
    private subTaskRepo: Repository<SubTask>
  ) {}

  async execute({ id, ...command }: UpdateSubTask): Promise<any> {
    await this.subTaskRepo.update({ id }, command);
  }
}
