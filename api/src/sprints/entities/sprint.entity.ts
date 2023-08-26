import { Exclude, Expose } from 'class-transformer';
import { sortBy } from 'lodash';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SprintBacklogItem } from './sprint-backlog-item.entity';
import { patchObject } from 'src/object.functions';

export enum SprintStatus {
  IDLE = 'idle',
  IN_PROGRESS = 'in-progress',
  COMPLETED = 'completed',
}

@Entity()
export class Sprint {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Exclude()
  @OneToMany(() => SprintBacklogItem, (i) => i.sprint)
  items: SprintBacklogItem[];

  @Column()
  productId: number;

  @Column()
  order: number;

  @Column({ nullable: true })
  startedAt: Date;

  @Column({ nullable: true })
  endedAt: Date;

  @Column({ default: 'idle' })
  status: SprintStatus;

  constructor(partial: Partial<Sprint> = {}) {
    patchObject(this, partial);
  }

  @Expose({ name: 'issues' })
  get sortedIssues() {
    const items = sortBy(this.items, (i) => i.order);
    return items.map(({ issue, order }) => ({ ...issue, order }));
  }

  @Expose()
  get hasntStarted() {
    return this.status === SprintStatus.IDLE;
  }

  @Expose()
  get isOnGoing() {
    return this.status === SprintStatus.IN_PROGRESS;
  }

  @Expose()
  get hasEnded() {
    return this.status === SprintStatus.COMPLETED;
  }

  start() {
    if (this.isOnGoing)
      throw new CannotStartSprintException('sprint is on going');
    if (this.hasEnded) throw new CannotStartSprintException('sprint has ended');
    this.status = SprintStatus.IN_PROGRESS;
  }

  end() {
    if (!this.isOnGoing)
      throw new CannotEndSprintException("sprint hasn't started yet");
    if (this.hasEnded) throw new CannotEndSprintException('sprint has ended');
    this.status = SprintStatus.COMPLETED;
  }
}

export class CannotStartSprintException extends Error {
  constructor(cause: string) {
    super(`Can not start sprint${cause ? `: ${cause}` : ''}`);
  }
}

export class CannotEndSprintException extends Error {
  constructor(cause: string) {
    super(`Can not end sprint${cause ? `: ${cause}` : ''}`);
  }
}
