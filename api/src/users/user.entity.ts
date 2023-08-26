import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Exclude()
  @Column()
  password: string;

  constructor(partials: Partial<User> = {}) {
    this.id = partials.id;
    this.name = partials.name;
    this.email = partials.email;
    this.password = partials.password;
  }

  verifyPassword(password: string) {
    return bcrypt.compare(password, this.password);
  }
}
