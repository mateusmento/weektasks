import { Controller, Get, Param } from '@nestjs/common';
import { MessagingService } from './messaging.service';

@Controller('contacts')
export class MessagingController {
  constructor(private contactService: MessagingService) {}

  @Get(':contactId/messages')
  findMessages(@Param('contactId') contactId: number) {
    return this.contactService.findMessages(contactId);
  }
}
