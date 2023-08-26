import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MessageEntity } from './message.entity';
import { ContactEntity } from 'src/contact/contact.entity';

@Injectable()
export class MessagingService {
  constructor(
    @InjectRepository(MessageEntity)
    private messageRepo: Repository<MessageEntity>,
    @InjectRepository(ContactEntity)
    private contactRepo: Repository<ContactEntity>
  ) {}

  async findMessages(contactId: number) {
    return this.messageRepo.find({
      where: { contactId },
      relations: { speaker: true },
    });
  }

  async createMessage(text: string, contactId: number, speakerId: number) {
    const message = await this.messageRepo.save({ text, contactId, speakerId });
    this.contactRepo.update({ id: contactId }, { lastMessageId: message.id });
    return message;
  }
}
