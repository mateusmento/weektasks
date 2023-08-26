import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from 'src/test-database.module';
import { BacklogModule } from '../../backlog.module';
import { patchObject } from 'src/object.functions';
import { CreateIssueInBacklogCommand } from '../create-issue-in-backlog.command';
import { ProductsModule } from 'src/products/products.module';
import { CreateProductCommand } from 'src/products/features/create-product.command';
import { Product } from 'src/products/entities/product.entity';
import { Issue } from 'src/issues/entities/issue.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { IssuesModule } from 'src/issues/issues.module';
import { CreateUser } from 'src/users/features/create-user.command';
import { UsersModule } from 'src/users/users.module';

describe('Create issue command', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let issueRepo: Repository<Issue>;
  let productRepo: Repository<Product>;

  let product: Product;

  beforeEach(async () => {
    initializeTransactionalContext();

    module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        BacklogModule,
        ProductsModule,
        IssuesModule,
        UsersModule,
      ],
    }).compile();

    await module.init();

    commandBus = module.get(CommandBus);
    issueRepo = module.get(getRepositoryToken(Issue));
    productRepo = module.get(getRepositoryToken(Product));
  });

  beforeEach(async () => {
    const user = await commandBus.execute(
      new CreateUser({
        name: 'User 1',
        email: 'user1@email.com',
        password: 'user123',
      })
    );

    product = await commandBus.execute(
      patchObject(new CreateProductCommand(), {
        name: 'Product 1',
        ownerId: user.id,
      })
    );
  });

  it('should create a issue', async () => {
    product = await productRepo.findOneBy({ id: product.id });

    let issue: Issue = await commandBus.execute(
      patchObject(new CreateIssueInBacklogCommand(), {
        productId: product.id,
        title: 'Issue 1',
      })
    );

    issue = await issueRepo.findOneBy({ id: issue.id });

    expect(issue.title).toBe('Issue 1');
    expect(issue.productId).toBe(product.id);
  });
});
