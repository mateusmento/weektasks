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
    private contactService: MessagingService,
    private jwtService: JwtService
  ) {}

  @SubscribeMessage('join-messaging')
  joinContact(
    @MessageBody() { contactId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    socket.join(`messaging:${contactId}`);
  }

  @SubscribeMessage('send-message')
  async sendMessage(
    @MessageBody() { contactId, message }: any,
    @ConnectedSocket() socket: Socket
  ) {
    const token = socket.request.headers.authorization;
    const user = await this.jwtService.verifyAsync(token);
    message = await this.contactService.createMessage(
      message.text,
      contactId,
      user.id
    );
    socket.to(`messaging:${contactId}`).emit('receive-message', message);
    return message;
  }
}
