import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialEntity } from './domain/credential.entity';
import { AuthController } from './application/auth.controller';
import { AuthService } from './domain/auth.service';
import { LocalStrategy } from './application/passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './application/passport/jwt.strategy';
import { UserEntity } from './domain/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([CredentialEntity, UserEntity]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        global: true,
        secret: config.get('JWT_SECRET'),
        signOptions: {
          expiresIn: config.get('JWT_EXPIRES_IN'),
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [TypeOrmModule, JwtModule],
})
export class AuthModule {}
