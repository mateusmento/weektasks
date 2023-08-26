import { Expose } from 'class-transformer';
import { patchObject } from 'src/object.functions';
import { User } from 'src/users/user.entity';
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

  @ManyToOne(() => User)
  author: User;

  @Expose()
  liked = false;

  constructor(partial: Partial<Discussion> = {}) {
    patchObject(this, partial);
  }
}
