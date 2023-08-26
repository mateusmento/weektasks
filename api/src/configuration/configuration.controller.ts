import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Configuration } from './configuration.entity';
import { Repository } from 'typeorm';

@Controller('/configurations')
export class ConfigurationController {
  constructor(
    @InjectRepository(Configuration)
    private configRepo: Repository<Configuration>
  ) {}

  @Get()
  getConfiguration() {
    return this.configRepo.find();
  }

  @Post()
  createConfiguration(@Body() configData: any) {
    return this.configRepo.save(configData);
  }
}
