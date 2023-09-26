import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/application/passport/jwt.strategy';
import { UserEntity } from 'src/auth/domain/user.entity';
import { AuthUser } from 'src/auth/utils/auth-user';
import { ChatService } from './chat.service';
import { CreateChatDto } from './create-chat.dto';

@Controller('chats')
export class ChatController {
  constructor(private chatService: ChatService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  findChat(@AuthUser() user: UserEntity) {
    return this.chatService.findChats(user.id);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  createChat(
    @Body() { username }: CreateChatDto,
    @AuthUser() user: UserEntity
  ) {
    return this.chatService.createDirectChat(user.id, username);
  }
}
