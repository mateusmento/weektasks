import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CredentialEntity } from './credential.entity';
import { patchObject } from '../../functions';

@Entity({ name: 'users' })
export class UserEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column()
  name: string;

  @OneToOne(() => CredentialEntity, { cascade: ['insert'] })
  @JoinColumn()
  credential: CredentialEntity;

  constructor(partial: Partial<UserEntity>) {
    patchObject(this, partial);
  }
}
