import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Exclude, Expose, TransformPlainToInstance } from 'class-transformer';
import { Like, Repository } from 'typeorm';
import { User } from '../user.entity';
import { Allow } from 'class-validator';

export class FindUsers {
  @Allow()
  name: string;
}

@Exclude()
export class UserDto {
  @Expose()
  id: number;
  @Expose()
  name: string;
  @Expose()
  email: string;
}

@QueryHandler(FindUsers)
export class FindUsersHandler implements IQueryHandler {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>
  ) {}

  @TransformPlainToInstance(UserDto)
  async execute(query: FindUsers): Promise<UserDto[]> {
    return this.userRepo.findBy({
      name: Like(`%${query.name}%`),
    });
  }
}
