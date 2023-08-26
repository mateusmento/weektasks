import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from './configuration.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Configuration])],
  exports: [TypeOrmModule],
})
export class ConfigurationModule {}
