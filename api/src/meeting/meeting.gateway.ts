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
    @MessageBody() { contactId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    socket.join(`contact:${contactId}:meeting-notification`);
  }

  @SubscribeMessage('request-meeting')
  async requestMeeting(
    @MessageBody() { contactId }: any,
    @ConnectedSocket() socket: Socket
  ) {
    const meeting = await this.meetingService.startMeeting(contactId);
    socket
      .to(`contact:${contactId}:meeting-notification`)
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
        .to(`contact:${meeting.contactId}:meeting-notification`)
        .emit('meeting-ended', { meetingId, contactId: meeting.contactId });
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
      .to(`contact:${meeting.contactId}:meeting-notification`)
      .emit('meeting-ended', { meetingId, contactId: meeting.contactId });
    this.server.socketsLeave(roomId);
  }
}
