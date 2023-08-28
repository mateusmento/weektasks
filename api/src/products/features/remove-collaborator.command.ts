import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Collaborator } from '../entities/collaborator.entity';
import { Repository } from 'typeorm';
import { Product } from '../entities/product.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Transactional } from 'typeorm-transactional';

export class RemoveCollaboratorCommand {
  productId: number;
  collaboratorId: number;
  actorId: any;
}

@CommandHandler(RemoveCollaboratorCommand)
export class RemoveCollaboratorHandler
  implements ICommandHandler<RemoveCollaboratorCommand>
{
  constructor(
    @InjectRepository(Product)
    private productRepo: Repository<Product>,
    @InjectRepository(Collaborator)
    private collabRepo: Repository<Collaborator>
  ) {}

  @Transactional()
  async execute(command: RemoveCollaboratorCommand): Promise<any> {
    const { productId, actorId, collaboratorId } = command;
    const product = await this.productRepo.findOneBy({ id: productId });
    if (product.ownerId !== actorId)
      throw new HttpException(
        'User is not allow to remove collaborator',
        HttpStatus.FORBIDDEN
      );
    await this.collabRepo.delete({ id: collaboratorId, productId });
  }
}
