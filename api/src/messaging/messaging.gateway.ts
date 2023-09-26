import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { MessagingService } from './messaging.service';

@WebSocketGateway()
export class MessagingGateway {
  constructor(
    private chatService: MessagingService,
    private jwtService: JwtService
  ) {}

  @SubscribeMessage('join-messaging')
  joinChat(@MessageBody() { chatId }: any, @ConnectedSocket() socket: Socket) {
    socket.join(`messaging:${chatId}`);
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() { chatId, message }: any,
    @ConnectedSocket() socket: Socket
  ) {
    const token = socket.request.headers.authorization;
    const user = await this.jwtService.verifyAsync(token);
    message = await this.chatService.createMessage(
      message.text,
      chatId,
      user.id
    );
    socket.to(`messaging:${chatId}`).emit('receive-message', message);
    return message;
  }
}
