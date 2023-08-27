import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CredentialEntity } from './domain/credential.entity';
import { AuthController } from './application/auth.controller';
import { AuthService } from './domain/auth.service';
import { LocalStrategy } from './application/passport/local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './application/passport/jwt.strategy';
import { UserEntity } from './domain/user.entity';
import { AppConfig } from 'src/app.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([CredentialEntity, UserEntity]),
    JwtModule.registerAsync({
      inject: [AppConfig],
      useFactory: (config: AppConfig) => ({
        global: true,
        secret: config.JWT_SECRET,
        signOptions: {
          expiresIn: config.JWT_EXPIRES_IN,
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy],
  exports: [TypeOrmModule, JwtModule],
})
export class AuthModule {}
