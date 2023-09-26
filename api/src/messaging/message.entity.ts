import { UserEntity } from '../auth/domain/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ChatEntity } from '../chat/chat.entity';

@Entity({ name: 'messages' })
export class MessageEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;
  @Column()
  text: string;
  @CreateDateColumn()
  sentAt: Date;
  @Column()
  speakerId: number;
  @ManyToOne(() => UserEntity)
  speaker: UserEntity;
  @Column()
  chatId: number;
  @ManyToOne(() => ChatEntity)
  chat: ChatEntity;
}
