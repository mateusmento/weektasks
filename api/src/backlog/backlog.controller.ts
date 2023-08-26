import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { patchObject } from 'src/object.functions';
import { JwtAuthGuard } from 'src/auth/application/passport/jwt.strategy';
import { CreateIssueInBacklogCommand } from './features/create-issue-in-backlog.command';
import { FindBacklogItemsQuery } from './features/find-backlog-items.query';
import { MoveBacklogItemCommand } from './features/move-backlog-item.command';
import { IncludeBacklogItemCommand } from './features/include-backlog-item.command';
import { RemoveBacklogItemCommand } from './features/remove-backlog-item.command';

@UseGuards(JwtAuthGuard)
@Controller('/products/:productId/issues')
export class ProductIssuesController {
  constructor(private commandBus: CommandBus) {}

  @Post()
  createIssue(
    @Param('productId') productId: number,
    @Body() command: CreateIssueInBacklogCommand
  ) {
    command.productId = productId;
    return this.commandBus.execute(command);
  }
}

@UseGuards(JwtAuthGuard)
@Controller('/products/:productId/backlog-items')
export class BacklogController {
  constructor(
    private queryBus: QueryBus,
    private commandBus: CommandBus
  ) {}

  @Get()
  findBacklogItems(@Param('productId') productId: number) {
    const query = patchObject(new FindBacklogItemsQuery(), { productId });
    return this.queryBus.execute(query);
  }

  @Post()
  includeBacklogItem(
    @Param('productId') productId: number,
    @Body() command: IncludeBacklogItemCommand
  ) {
    command = patchObject(command, { productId });
    return this.commandBus.execute(command);
  }

  @Put(':itemId/order')
  moveBacklogItem(
    @Param('productId') productId: number,
    @Param('itemId') issueId: number,
    @Body('order') order: number
  ) {
    const command = patchObject(new MoveBacklogItemCommand(), {
      productId,
      issueId,
      order,
    });
    return this.commandBus.execute(command);
  }

  @Delete(':itemId')
  removeBacklogItem(
    @Param('productId') productId: number,
    @Param('itemId') issueId: number
  ) {
    const command = patchObject(new RemoveBacklogItemCommand(), {
      productId,
      issueId,
    });
    return this.commandBus.execute(command);
  }
}
