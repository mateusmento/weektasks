import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeetingAttendeeEntity, MeetingEntity } from './meeting.entity';

export class MeetingHasntStartedException extends Error {}

@Injectable()
export class MeetingService {
  constructor(
    @InjectRepository(MeetingEntity)
    private meetingRepo: Repository<MeetingEntity>,
    @InjectRepository(MeetingAttendeeEntity)
    private meetingAttendeeRepo: Repository<MeetingAttendeeEntity>
  ) {}

  findMeeting(id: number) {
    return this.meetingRepo.findOneBy({ id });
  }

  async startMeeting(contactId: number) {
    const ongoingMeeting = MeetingEntity.ongoing(contactId);
    return await this.meetingRepo.save(ongoingMeeting);
  }

  async joinMeeting(meetingId: number, remoteId: string, userId: number) {
    const ongoingMeeting = await this.meetingRepo.findOne({
      where: { id: meetingId, ongoing: true },
      relations: { attendees: true },
    });
    if (!ongoingMeeting) throw new MeetingHasntStartedException();
    ongoingMeeting.addAttendee(remoteId, userId);
    return await this.meetingRepo.save(ongoingMeeting);
  }

  async leaveMeeting(meetingId: number, remoteId: string) {
    await this.meetingAttendeeRepo.delete({ remoteId });
    return this.meetingAttendeeRepo.countBy({ meetingId });
  }

  async endMeeting(meetingId: number) {
    await this.meetingAttendeeRepo.delete({ meetingId });
    return this.meetingRepo.delete({ id: meetingId });
  }
}
