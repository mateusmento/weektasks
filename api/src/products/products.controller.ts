import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { patchObject } from 'src/object.functions';
import { AuthUser } from 'src/auth/auth-user.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { CreateProductCommand } from './features/create-product.command';
import { FindProductsQuery } from './features/find-products.query';
import { FindProductQuery } from './features/find-product.query';
import { IncludeCollaboratorCommand } from './features/include-collaborator.command';
import { RemoveCollaboratorCommand } from './features/remove-collaborator.command';
import { FindCollaboratorsQuery } from './features/find-collaborators.query';

@UseGuards(JwtAuthGuard)
@Controller('products')
export class ProductsController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus
  ) {}

  @Get()
  findProducts(@AuthUser() user: any) {
    const query = patchObject(new FindProductsQuery(), {
      owner: user,
    });
    return this.queryBus.execute(query);
  }

  @Get(':id')
  findProduct(@Param('id') id: number) {
    const query = patchObject(new FindProductQuery(), {
      productId: id,
    });
    return this.queryBus.execute(query);
  }

  @Get(':id/collaborators')
  findCollaborators(@Param('id') productId: number) {
    const query = patchObject(new FindCollaboratorsQuery(), { productId });
    return this.queryBus.execute(query);
  }

  @Post()
  createProduct(@Body() command: CreateProductCommand, @AuthUser() user: any) {
    command = patchObject(command, { ownerId: user.id });
    return this.commandBus.execute(command);
  }

  @Post(':id/collaborators')
  includeCollaborator(
    @Param('id') id: number,
    @Body() command: IncludeCollaboratorCommand,
    @AuthUser() user: any
  ) {
    command = patchObject(command, { productId: id, actorId: user.id });
    return this.commandBus.execute(command);
  }

  @Delete(':id/collaborators/:collabId')
  removeCollaborator(
    @Param('id') productId: number,
    @Param('collabId') collaboratorId: number,
    @AuthUser() user: any
  ) {
    const command = patchObject(new RemoveCollaboratorCommand(), {
      productId,
      collaboratorId,
      actorId: user.id,
    });
    return this.commandBus.execute(command);
  }
}
