import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfig } from './app.config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeormConfig } from './typeorm.config';
import { DataSource } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';
import { AuthModule } from './auth/auth.module';
import { ContactModule } from './contact/contact.module';
import { MessagingModule } from './messaging/messaging.module';
import { MeetingModule } from './meeting/meeting.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: () => typeormConfig,
      dataSourceFactory: async (config) =>
        addTransactionalDataSource(new DataSource(config)),
    }),
    AuthModule,
    ContactModule,
    MessagingModule,
    MeetingModule,
  ],
  providers: [AppConfig],
})
export class AppModule {}
