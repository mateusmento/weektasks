import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNotEmpty } from 'class-validator';
import { Repository } from 'typeorm';
import { Discussion } from '../../entities/discussion.entity';

export class CreateDiscussion {
  productId: number;
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  type: string;
  authorId: number;
}

@CommandHandler(CreateDiscussion)
export class CreateDiscussionCommand
  implements ICommandHandler<CreateDiscussion>
{
  constructor(
    @InjectRepository(Discussion)
    private discussionRepo: Repository<Discussion>
  ) {}

  async execute(command: CreateDiscussion): Promise<any> {
    return this.discussionRepo.save(new Discussion(command));
  }
}
