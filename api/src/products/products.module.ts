import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsController } from './products.controller';
import { Product } from './entities/product.entity';
import { CreateProductHandler } from './features/create-product.command';
import { FindProductsHandler } from './features/find-products.query';
import { CqrsModule } from '@nestjs/cqrs';
import { FindProductHandler } from './features/find-product.query';
import { Collaborator } from './entities/collaborator.entity';
import { FindCollaboratorsHandler } from './features/find-collaborators.query';
import { IncludeCollaboratorHandler } from './features/include-collaborator.command';
import { RemoveCollaboratorHandler } from './features/remove-collaborator.command';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Collaborator]),
    CqrsModule,
    AuthModule,
  ],
  controllers: [ProductsController],
  providers: [
    CreateProductHandler,
    FindProductsHandler,
    FindProductHandler,
    FindCollaboratorsHandler,
    IncludeCollaboratorHandler,
    RemoveCollaboratorHandler,
  ],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
