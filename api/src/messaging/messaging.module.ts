import { Module } from '@nestjs/common';
import { MessagingService } from './messaging.service';
import { MessagingGateway } from './messaging.gateway';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessageEntity } from './message.entity';
import { AuthModule } from 'src/auth/auth.module';
import { MessagingController } from './messaging.controller';
import { ContactModule } from 'src/contact/contact.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MessageEntity]),
    AuthModule,
    ContactModule,
  ],
  controllers: [MessagingController],
  providers: [MessagingService, MessagingGateway],
})
export class MessagingModule {}
