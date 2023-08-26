import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export class FindProductsQuery {
  owner: User;
}

@QueryHandler(FindProductsQuery)
export class FindProductsHandler implements IQueryHandler<FindProductsQuery> {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}

  async execute({ owner }: FindProductsQuery): Promise<Product[]> {
    return this.productRepo.find({
      where: { ownerId: owner.id },
    });
  }
}
