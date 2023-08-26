import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Issue } from './issue.entity';

@Entity()
export class SubTask {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column({ default: false })
  completed: boolean;
  @Column()
  issueId: number;
  @ManyToOne(() => Issue)
  issue: Issue;
}
