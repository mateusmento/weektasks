import { IsString, MinLength } from 'class-validator';
import { CommandHandler, ICommand, ICommandHandler } from '@nestjs/cqrs';
import { User } from '../user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Transactional } from 'typeorm-transactional';
import { patchObject } from 'src/object.functions';
import { HttpException, HttpStatus } from '@nestjs/common';

export class CreateUser implements ICommand {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  constructor(partial: Partial<CreateUser> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(CreateUser)
export class CreateUserHandler implements ICommandHandler<CreateUser> {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,
    private configService: ConfigService
  ) {}

  @Transactional()
  async execute(command: CreateUser) {
    const user = await this.userRepo.findOneBy({ email: command.email });
    if (user)
      throw new HttpException(
        'Email is being used by another user',
        HttpStatus.CONFLICT
      );
    const password = await bcrypt.hash(
      command.password,
      this.configService.get<string>('PASSWORD_ROUNDS')
    );
    return this.userRepo.save(new User({ ...command, password }));
  }
}
