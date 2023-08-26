import { Module } from '@nestjs/common';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactEntity } from './contact.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ContactEntity]), AuthModule],
  controllers: [ContactController],
  providers: [ContactService],
  exports: [TypeOrmModule],
})
export class ContactModule {}
