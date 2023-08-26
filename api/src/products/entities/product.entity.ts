import { User } from 'src/users/user.entity';
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Collaborator } from './collaborator.entity';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  ownerId: number;

  @ManyToOne(() => User)
  owner: User;

  @OneToMany(() => Collaborator, (c) => c.product)
  collaborators: Collaborator[];
}
