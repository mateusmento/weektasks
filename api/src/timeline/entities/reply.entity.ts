import { Expose } from 'class-transformer';
import { UserEntity } from 'src/users/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

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

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity)
  author: UserEntity;
}
