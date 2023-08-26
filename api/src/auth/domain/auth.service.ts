import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CredentialEntity } from './credential.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from './user.entity';
import { CreateCredentialDto } from '../application/dtos/create-credential.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(CredentialEntity)
    private credentialRepo: Repository<CredentialEntity>,
    @InjectRepository(UserEntity)
    private userRepo: Repository<UserEntity>,
    private config: ConfigService,
    private jwtService: JwtService
  ) {}

  async createCredential(data: CreateCredentialDto) {
    const salt = await bcrypt.genSalt(+this.config.get('PASSWORD_ROUNDS'));
    data.password = await bcrypt.hash(data.password, salt);
    try {
      return await this.userRepo.save({
        name: data.name,
        credential: data,
      });
    } catch (ex) {
      throw new ConflictException('Username is being used by another user');
    }
  }

  async authenticate(username: string, password: string) {
    const credential = await this.credentialRepo.findOne({
      where: { username },
      relations: { user: true },
    });
    if (!credential)
      throw new NotFoundException("Username and password don't match");
    if (!(await credential.verify(password)))
      throw new UnauthorizedException("Username and password don't match");
    return credential.user;
  }

  async token(user: UserEntity) {
    return await this.jwtService.signAsync({ ...user });
  }

  async verify(user: UserEntity) {
    return user;
  }
}
