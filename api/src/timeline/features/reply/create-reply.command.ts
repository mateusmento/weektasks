import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNotEmpty } from 'class-validator';
import { Repository } from 'typeorm';
import { Reply } from '../../entities/reply.entity';

export class CreateReply {
  @IsNotEmpty()
  text: string;
  discussionId: number;
  authorId: number;
}

@CommandHandler(CreateReply)
export class CreateReplyCommand implements ICommandHandler<CreateReply> {
  constructor(
    @InjectRepository(Reply)
    private replyRepo: Repository<Reply>
  ) {}

  async execute(command: CreateReply): Promise<any> {
    const { id } = await this.replyRepo.save(command);
    return this.replyRepo.findOne({
      where: { id },
      relations: { author: true },
    });
  }
}
