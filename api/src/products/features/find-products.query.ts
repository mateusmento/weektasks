import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';

export class FindProductsQuery {
  userId: number;
}

@QueryHandler(FindProductsQuery)
export class FindProductsHandler implements IQueryHandler<FindProductsQuery> {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}

  async execute({ userId }: FindProductsQuery) {
    const products = await this.productRepo
      .createQueryBuilder('p')
      .innerJoin('p.collaborators', 'c')
      .where('c.userId = :userId or p.ownerId = :userId', { userId })
      .getMany();

    return {
      own: products.filter((p) => p.ownerId === userId),
      collaborating: products.filter((p) => p.ownerId !== userId),
    };
  }
}
