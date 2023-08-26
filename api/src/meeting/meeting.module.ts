import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeetingAttendeeEntity, MeetingEntity } from './meeting.entity';
import { MeetingService } from './meeting.service';
import { MeetingGateway } from './meeting.gateway';

@Module({
  imports: [TypeOrmModule.forFeature([MeetingEntity, MeetingAttendeeEntity])],
  providers: [MeetingService, MeetingGateway],
})
export class MeetingModule {}
