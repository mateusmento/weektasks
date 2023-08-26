import { CommandBus } from '@nestjs/cqrs';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as moment from 'moment';
import { patchObject } from 'src/object.functions';
import { Product } from 'src/products/entities/product.entity';
import { CreateProductCommand } from 'src/products/features/create-product.command';
import { ProductsModule } from 'src/products/products.module';
import { Sprint } from 'src/sprints/entities/sprint.entity';
import { SprintsModule } from 'src/sprints/sprints.module';
import { TestDatabaseModule } from 'src/test-database.module';
import { Repository } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';
import { CreateSprintCommand } from 'src/sprints/features/create-sprint.command';
import { AuthModule } from 'src/auth/auth.module';
import { AuthService } from 'src/auth/domain/auth.service';
import { EventEmitterModule } from '@nestjs/event-emitter';

describe('Create sprint command', () => {
  let module: TestingModule;
  let commandBus: CommandBus;
  let sprintRepo: Repository<Sprint>;
  let productRepo: Repository<Product>;
  let authService: AuthService;

  let product: Product;

  beforeEach(async () => {
    initializeTransactionalContext();

    module = await Test.createTestingModule({
      imports: [
        TestDatabaseModule,
        EventEmitterModule.forRoot(),
        SprintsModule,
        ProductsModule,
        AuthModule,
      ],
    }).compile();

    await module.init();

    commandBus = module.get(CommandBus);
    sprintRepo = module.get(getRepositoryToken(Sprint));
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

  it('should create a sprint', async () => {
    product = await productRepo.findOneBy({ id: product.id });

    let sprint: Sprint = await commandBus.execute(
      patchObject(new CreateSprintCommand(), {
        productId: product.id,
        title: 'Sprint 1',
      })
    );

    sprint = await sprintRepo.findOneBy({ id: sprint.id });

    expect(sprint.title).toBe('Sprint 1');
    expect(sprint.productId).toBe(product.id);
    expect(sprint.startedAt).toStrictEqual(
      moment.utc().startOf('day').toDate()
    );
    expect(sprint.endedAt).toStrictEqual(
      moment.utc().add(6, 'day').endOf('day').toDate()
    );

    expect(await sprintRepo.count()).toBe(1);

    let sprint2: Sprint = await commandBus.execute(
      patchObject(new CreateSprintCommand(), {
        productId: product.id,
        title: 'Sprint 2',
      })
    );

    expect(await sprintRepo.count()).toBe(2);

    sprint2 = await sprintRepo.findOneBy({ id: sprint2.id });

    expect(sprint2.title).toBe('Sprint 2');
    expect(sprint2.startedAt).toStrictEqual(
      moment.utc(sprint.endedAt).add(1, 'days').startOf('day').toDate()
    );
  });
});
