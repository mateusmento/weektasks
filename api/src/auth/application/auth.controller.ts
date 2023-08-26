import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateCredentialDto } from './dtos/create-credential.dto';
import { AuthService } from '../domain/auth.service';
import { LocalAuthGuard } from './passport/local.strategy';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './passport/jwt.strategy';
import { UserEntity } from '../domain/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('users')
  createCredential(@Body() data: CreateCredentialDto) {
    return this.authService.createCredential(data);
  }

  @Get('access')
  @UseGuards(JwtAuthGuard)
  async access(@Req() req: Request) {
    return { token: req.cookies.token, user: req.user };
  }

  @Post('access')
  @UseGuards(LocalAuthGuard)
  async createAccess(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response
  ) {
    const token = await this.authService.token(req.user as UserEntity);
    res.cookie('token', token, { httpOnly: true, sameSite: 'lax' });
    return { token, user: req.user };
  }

  @UseGuards(JwtAuthGuard)
  @Delete('access')
  async signout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('token');
  }
}
