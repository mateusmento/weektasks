import { UserEntity } from '../auth/domain/user.entity';
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

type ChatType = 'direct' | 'group';

@Entity({ name: 'chats' })
export class ChatEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ default: 'direct' })
  type: ChatType;

  @ManyToMany(() => UserEntity)
  @JoinTable({ name: 'chat_peers' })
  peers: UserEntity[];

  speakingTo: UserEntity;

  @OneToOne(() => MeetingEntity, (m) => m.chat)
  meeting: MeetingEntity;

  @Column({ default: null })
  lastMessageId: number;

  @ManyToOne(() => MessageEntity)
  lastMessage: MessageEntity;

  @CreateDateColumn()
  createdAt: Date;
}
