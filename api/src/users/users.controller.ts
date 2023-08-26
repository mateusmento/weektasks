import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query,
  StreamableFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateUser } from './features/create-user.command';
import { FindUsers } from './features/find-users.command';
import { FileInterceptor } from '@nestjs/platform-express';
import { createReadStream } from 'fs';

@Controller('users')
export class UsersController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  findUsers(@Query() findUsers: FindUsers) {
    return this.queryBus.execute(findUsers);
  }

  @Post()
  createUser(@Body() createUser: CreateUser) {
    return this.commandBus.execute(createUser);
  }

  @Get(':id/photo')
  async getFile(@Param('id') id: number) {
    const stream = createReadStream(`./storage/user-photo/${id}`);
    return new StreamableFile(stream);
  }

  @Put('photo')
  @UseInterceptors(FileInterceptor('photo'))
  uploadPhoto() {
    return;
  }
}
