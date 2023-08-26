import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FindUsersHandler } from './features/find-users.command';
import { UserEntity } from '../auth/domain/user.entity';
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
  providers: [FindUsersHandler],
  exports: [TypeOrmModule],
})
export class UsersModule {}
