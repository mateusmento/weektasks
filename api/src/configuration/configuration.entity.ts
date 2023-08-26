import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class Configuration {
  @PrimaryGeneratedColumn()
  id: number;
  @Column({ unique: true })
  key: string;
  @Column()
  value: string;
}
