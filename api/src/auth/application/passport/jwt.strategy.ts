import { Injectable } from '@nestjs/common';
import { AuthGuard, PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt';
import { AppConfig } from 'src/app.config';
import { AuthService } from 'src/auth/domain/auth.service';
import { UserEntity } from 'src/auth/domain/user.entity';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService,
    config: AppConfig
  ) {
    super({
      secretOrKey: config.JWT_SECRET,
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (req) => req.cookies?.token,
      ]),
    } as StrategyOptions);
  }

  async validate(user: UserEntity) {
    return this.authService.verify(user);
  }
}
