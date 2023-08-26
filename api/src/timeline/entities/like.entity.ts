import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class Like {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  discussionId: number;
}
