import { Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class ReplyLike {
  @PrimaryColumn()
  userId: number;
  @PrimaryColumn()
  replyId: number;
}
