import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactEntity } from '../contact/contact.entity';
import { UserEntity } from '../users/user.entity';

@Entity({ name: 'meetings' })
export class MeetingEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column()
  ongoing: boolean;

  @OneToMany(() => MeetingAttendeeEntity, (p) => p.meeting, {
    cascade: ['insert', 'remove'],
  })
  attendees: MeetingAttendeeEntity[];

  @Column()
  contactId: number;

  @OneToOne(() => ContactEntity)
  @JoinColumn()
  contact: ContactEntity;

  static ongoing(contactId: number) {
    const meeting = new MeetingEntity();
    meeting.ongoing = true;
    meeting.contactId = contactId;
    meeting.attendees = [];
    return meeting;
  }

  addAttendee(remoteId: string, userId: number) {
    this.attendees.push(MeetingAttendeeEntity.of(remoteId, userId));
  }
}

@Entity({ name: 'meeting_attendees' })
export class MeetingAttendeeEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column()
  remoteId: string;

  @Column()
  userId: number;

  @ManyToOne(() => UserEntity)
  user: UserEntity;

  @Column()
  meetingId: number;

  @ManyToOne(() => MeetingEntity)
  meeting: MeetingEntity;

  static of(remoteId: string, userId: number) {
    const attendee = new MeetingAttendeeEntity();
    attendee.remoteId = remoteId;
    attendee.userId = userId;
    return attendee;
  }
}
