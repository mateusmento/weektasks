import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { patchObject } from 'src/object.functions';
import { IsNumber } from 'class-validator';
import { HttpException, HttpStatus } from '@nestjs/common';

export class FindProductQuery {
  @IsNumber()
  productId: number;

  constructor(partial: Partial<FindProductQuery> = {}) {
    patchObject(this, partial);
  }
}

@QueryHandler(FindProductQuery)
export class FindProductHandler implements IQueryHandler<FindProductQuery> {
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>
  ) {}

  async execute({ productId }: FindProductQuery): Promise<Product> {
    const product = this.productRepo.findOne({
      where: { id: productId },
      relations: { collaborators: { user: true } },
    });
    if (!product)
      throw new HttpException('Product not found', HttpStatus.NOT_FOUND);
    return product;
  }
}
