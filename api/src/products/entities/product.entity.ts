import { UserEntity } from 'src/auth/domain/user.entity';
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

  @ManyToOne(() => UserEntity)
  owner: UserEntity;

  @OneToMany(() => Collaborator, (c) => c.product)
  collaborators: Collaborator[];
}
