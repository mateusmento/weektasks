import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { TestDatabaseModule } from 'src/test-database.module';
import { BacklogModule } from 'src/backlog/backlog.module';
import { patchObject } from 'src/object.functions';
import { CreateIssueInBacklogCommand } from 'src/backlog/features/create-issue-in-backlog.command';
import { ProductsModule } from 'src/products/products.module';
import { CreateProductCommand } from 'src/products/features/create-product.command';
import { Product } from 'src/products/entities/product.entity';
import { Issue } from 'src/issues/entities/issue.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { IssuesModule } from 'src/issues/issues.module';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/domain/auth.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('Create issue command', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let issueRepo: Repository<Issue>;
  let productRepo: Repository<Product>;
  let authService: AuthService;

  let product: Product;

  beforeEach(async () => {
    initializeTransactionalContext();

    module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        BacklogModule,
        ProductsModule,
        IssuesModule,
        AuthModule,
        EventEmitterModule.forRoot(),
      ],
    }).compile();

    await module.init();

    commandBus = module.get(CommandBus);
    issueRepo = module.get(getRepositoryToken(Issue));
    productRepo = module.get(getRepositoryToken(Product));
    authService = module.get(AuthService);
  });

  beforeEach(async () => {
    const user = await authService.createCredential({
      name: 'User 1',
      username: 'user1@email.com',
      password: 'user123',
    });

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
