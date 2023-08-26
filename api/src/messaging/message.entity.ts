import { UserEntity } from '../users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ContactEntity } from '../contact/contact.entity';

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
  contactId: number;
  @ManyToOne(() => ContactEntity)
  contact: ContactEntity;
}
