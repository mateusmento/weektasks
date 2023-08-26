import { CommandHandler, EventBus, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsString } from 'class-validator';
import { patchObject } from 'src/object.functions';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { Transactional } from 'typeorm-transactional';

export class CreateProductCommand {
  @IsString()
  name: string;
  ownerId: number;
}

export class ProductCreatedEvent {
  product: Product;
}

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    private eventBus: EventBus
  ) {}

  @Transactional()
  async execute(command: CreateProductCommand): Promise<any> {
    const product = await this.productRepo.save(command);
    const event = patchObject(new ProductCreatedEvent(), { product });
    this.eventBus.publish(event);
    return product;
  }
}
