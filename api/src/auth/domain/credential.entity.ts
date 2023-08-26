import { Exclude } from 'class-transformer';
import { patchObject } from '../../functions';
import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../../users/user.entity';

@Entity({ name: 'credentials' })
export class CredentialEntity {
  @PrimaryGeneratedColumn('identity', { generatedIdentity: 'ALWAYS' })
  id: number;

  @Column({ unique: true })
  username: string;

  @Exclude()
  @Column()
  password: string;

  @OneToOne(() => UserEntity, (u) => u.credential)
  user: UserEntity;

  constructor(partial: Partial<CredentialEntity>) {
    patchObject(this, partial);
  }

  verify(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
