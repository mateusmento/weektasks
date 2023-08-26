import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/auth/domain/user.entity';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export class FindProductsQuery {
  owner: UserEntity;
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
