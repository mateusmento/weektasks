import { Controller, Get, Param } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('chats')
export class MessagingController {
  constructor(private chatService: MessagingService) {}

  @Get(':chatId/messages')
  findMessages(@Param('chatId') chatId: number) {
    return this.chatService.findMessages(chatId);
  }
}
