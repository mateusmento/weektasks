import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MeetingService } from './meeting.service';

@WebSocketGateway()
export class MeetingGateway {
  @WebSocketServer()
  server: Server;

  constructor(private meetingService: MeetingService) {}

  @SubscribeMessage('meeting-notification')
  async meetingNotification(
    @MessageBody() { chatId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    socket.join(`chat:${chatId}:meeting-notification`);
  }

  @SubscribeMessage('request-meeting')
  async requestMeeting(
    @MessageBody() { chatId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    const meeting = await this.meetingService.startMeeting(chatId);
    socket
      .to(`chat:${chatId}:meeting-notification`)
      .emit('incoming-meeting', { meeting });
    return meeting;
  }

  @SubscribeMessage('join-meeting')
  async joinMeeting(
    @MessageBody() { meetingId, remoteId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    const userId = (socket.request as any).user.id;
    const meeting = await this.meetingService.joinMeeting(
      meetingId,
      remoteId,
      userId
    );

    const roomId = `meeting:${meeting.id}`;
    socket.join(roomId);
    socket.to(roomId).emit('attendee-joined', { meeting, remoteId });

    socket.on('disconnect', () => {
      this.leaveMeeting({ meetingId, remoteId }, socket);
    });

    return meeting;
  }

  @SubscribeMessage('leave-meeting')
  async leaveMeeting(
    @MessageBody() { meetingId, remoteId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    const attendeesCount = await this.meetingService.leaveMeeting(
      meetingId,
      remoteId
    );

    const roomId = `meeting:${meetingId}`;

    if (attendeesCount > 0) {
      socket.to(roomId).emit('attendee-left', { remoteId });
    } else {
      const meeting = await this.meetingService.findMeeting(meetingId);
      if (!meeting) return;
      socket
        .to(`chat:${meeting.chatId}:meeting-notification`)
        .emit('meeting-ended', { meetingId, chatId: meeting.chatId });
      this.meetingService.endMeeting(meetingId);
      this.server.socketsLeave(roomId);
    }
  }

  @SubscribeMessage('end-meeting')
  async endMeeting(
    @MessageBody() { meetingId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    const meeting = await this.meetingService.findMeeting(meetingId);
    const roomId = `meeting:${meetingId}`;
    this.meetingService.endMeeting(meetingId);
    socket.to(roomId).emit('meeting-ended', { meetingId });
    socket
      .to(`chat:${meeting.chatId}:meeting-notification`)
      .emit('meeting-ended', { meetingId, chatId: meeting.chatId });
    this.server.socketsLeave(roomId);
  }
}
