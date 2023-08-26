import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNumber } from 'class-validator';
import { patchObject } from 'src/object.functions';
import { Collaborator } from '../entities/collaborator.entity';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

export class IncludeCollaboratorCommand {
  productId: number;
  @IsNumber()
  userId: number;
  actorId: number;

  constructor(partial: Partial<IncludeCollaboratorCommand> = {}) {
    patchObject(this, partial);
  }
}

@CommandHandler(IncludeCollaboratorCommand)
export class IncludeCollaboratorHandler
  implements ICommandHandler<IncludeCollaboratorCommand>
{
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Collaborator)
    private collaboratorRepo: Repository<Collaborator>
  ) {}

  @Transactional()
  async execute(command: IncludeCollaboratorCommand): Promise<any> {
    const { productId, userId, actorId } = command;
    const product = await this.productRepo.findOneBy({ id: productId });
    if (product.ownerId !== actorId)
      throw new HttpException(
        'User is not permitted to remove collaborator',
        HttpStatus.FORBIDDEN
      );
    return this.collaboratorRepo.save({ productId, userId });
  }
}
