import { Expose } from 'class-transformer';
import { patchObject } from 'src/object.functions';
import { UserEntity } from 'src/auth/domain/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Reply } from './reply.entity';

@Entity()
export class Discussion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column({ default: 'decision' })
  type: string;

  @Column({ default: 0 })
  likes: number;

  @Column({ nullable: true })
  issueId?: number;

  @Column()
  productId: number;

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity)
  author: UserEntity;

  @Expose()
  liked = false;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Reply, (r) => r.discussion)
  replies: Reply[];

  constructor(partial: Partial<Discussion> = {}) {
    patchObject(this, partial);
  }
}
