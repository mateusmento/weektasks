import { UserEntity } from 'src/auth/domain/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class IssueComment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;

  @Column()
  issueId: number;

  @Column()
  authorId: number;

  @ManyToOne(() => UserEntity)
  author: UserEntity;
}
