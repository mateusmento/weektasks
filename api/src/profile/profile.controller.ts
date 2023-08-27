import {
  Controller,
  Get,
  Param,
  Put,
  Query,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/auth/application/passport/jwt.strategy';
import { FindUsers } from './features/find-users.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';

@Controller('users')
export class ProfileController {
  constructor(private queryBus: QueryBus) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findUsers(@Query() findUsers: FindUsers) {
    return this.queryBus.execute(findUsers);
  }

  @Get(':id/photo')
  async getFile(@Param('id') id: number) {
    const stream = createReadStream(`./storage/user-photo/${id}.png`);
    return new StreamableFile(stream);
  }

  @Put('photo')
  @UseInterceptors(FileInterceptor('photo'))
  uploadPhoto() {
    return;
  }
}
