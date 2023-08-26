import { Issue } from 'src/issues/entities/issue.entity';
import { patchObject } from 'src/object.functions';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BacklogItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  productId: number;

  @Column()
  issueId: number;

  @ManyToOne(() => Issue, { createForeignKeyConstraints: false })
  issue: Issue;

  @Column()
  order: number;

  constructor(partial: Partial<BacklogItem> = {}) {
    patchObject(this, partial);
  }
}
