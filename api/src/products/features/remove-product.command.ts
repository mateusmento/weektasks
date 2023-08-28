import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { EntityManager } from 'typeorm';

export class RemoveProduct {
  productId: number;
}

@CommandHandler(RemoveProduct)
export class RemoveProductCommand implements ICommandHandler<RemoveProduct> {
  constructor(private em: EntityManager) {}

  async execute(command: RemoveProduct) {}
}
