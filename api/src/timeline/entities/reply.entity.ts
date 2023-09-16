import { Expose } from 'class-transformer';
import { UserEntity } from 'src/auth/domain/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Discussion } from './discussion.entity';
import { patchObject } from 'src/object.functions';

@Entity()
export class Reply {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: 0 })
  likes: number;

  @Expose()
  liked = false;

  @Column()
  discussionId: number;

  @ManyToOne(() => Discussion)
  discussion: Discussion;

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @CreateDateColumn()
  createdAt: Date;

  constructor(partial: Partial<Reply> = {}) {
    patchObject(this, partial);
  }
}
