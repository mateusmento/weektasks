import { UserEntity } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MeetingEntity } from '../meeting/meeting.entity';
import { MessageEntity } from '../messaging/message.entity';

type ContactType = 'direct' | 'group';

@Entity({ name: 'contacts' })
export class ContactEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ default: 'direct' })
  type: ContactType;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'contact_peers' })
  peers: UserEntity[];

  speakingTo: UserEntity;

  @OneToOne(() => MeetingEntity, (m) => m.contact)
  meeting: MeetingEntity;

  @Column({ default: null })
  lastMessageId: number;

  @ManyToOne(() => MessageEntity)
  lastMessage: MessageEntity;

  @CreateDateColumn()
  createdAt: Date;
}
