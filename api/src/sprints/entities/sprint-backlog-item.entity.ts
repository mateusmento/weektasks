import { Issue } from 'src/issues/entities/issue.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Sprint } from './sprint.entity';

@Entity()
export class SprintBacklogItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  sprintId: number;

  @ManyToOne(() => Sprint, { createForeignKeyConstraints: false })
  sprint: Sprint;

  @Column()
  issueId: number;

  @ManyToOne(() => Issue, { createForeignKeyConstraints: false })
  issue: Issue;

  @Column()
  order: number;
}
