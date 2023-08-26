import { Expose } from 'class-transformer';
import { patchObject } from 'src/object.functions';
import { UserEntity } from 'src/auth/domain/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  constructor(partial: Partial<Discussion> = {}) {
    patchObject(this, partial);
  }
}
