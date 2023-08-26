import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/application/passport/jwt.strategy';
import { UserEntity } from 'src/auth/domain/user.entity';
import { AuthUser } from 'src/auth/utils/auth-user';
import { ContactService } from './contact.service';
import { CreateContactDto } from './create-contact.dto';

@Controller('contacts')
export class ContactController {
  constructor(private contactService: ContactService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findContacts(@AuthUser() user: UserEntity) {
    return this.contactService.findContacts(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createContact(
    @Body() { username }: CreateContactDto,
    @AuthUser() user: UserEntity
  ) {
    return this.contactService.createDirectContact(user.id, username);
  }
}
