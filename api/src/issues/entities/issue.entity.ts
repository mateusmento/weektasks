import { User } from 'src/users/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SubTask } from './subtask.entity';

export type IssueStatus = 'todo' | 'doing' | 'done';

@Entity()
export class Issue {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column({ default: 'story' })
  type: string;

  @Column({ default: '' })
  description: string;

  @Column()
  productId: number;

  @Column({ default: 'todo' })
  status: IssueStatus;

  @Column({ nullable: true })
  estimation: number;

  @OneToMany(() => SubTask, (s) => s.issue)
  subtasks: SubTask[];

  @Column({ nullable: true })
  assignedToId: number;

  @ManyToOne(() => User)
  assignedTo: User;

  @ManyToMany(() => User)
  @JoinTable({
    name: 'assignee',
    joinColumn: { name: 'issue_id' },
    inverseJoinColumn: { name: 'user_id' },
  })
  assignees: User[];

  @CreateDateColumn()
  createdAt: string;
}
