import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Epic {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;
}
