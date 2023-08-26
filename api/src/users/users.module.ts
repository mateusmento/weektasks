import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateUserHandler } from './features/create-user.command';
import { FindUsersHandler } from './features/find-users.command';
import { UserEntity } from './user.entity';
import { UsersController } from './users.controller';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    CqrsModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './storage/user-photo',
        filename: (req, file, cb) => cb(null, `${(req.user as any)?.id}`),
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [CreateUserHandler, FindUsersHandler],
  exports: [TypeOrmModule],
})
export class UsersModule {}
