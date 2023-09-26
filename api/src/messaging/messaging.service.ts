import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { ChatEntity } from 'src/chat/chat.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    @InjectRepository(ChatEntity)
    private chatRepo: Repository<ChatEntity>
  ) {}

  async findMessages(chatId: number) {
    return this.messageRepo.find({
      where: { chatId },
      relations: { speaker: true },
    });
  }

  async createMessage(text: string, chatId: number, speakerId: number) {
    const message = await this.messageRepo.save({ text, chatId, speakerId });
    this.chatRepo.update({ id: chatId }, { lastMessageId: message.id });
    return message;
  }
}
