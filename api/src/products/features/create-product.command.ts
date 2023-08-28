import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsString } from 'class-validator';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Transactional } from 'typeorm-transactional';

export class CreateProductCommand {
  @IsString()
  name: string;
  ownerId: number;
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}

  @Transactional()
  async execute(command: CreateProductCommand): Promise<any> {
    return await this.productRepo.save(command);
  }
}
